import { NextResponse } from 'next/server';
import { Resend } from 'resend';

type Inquiry = {
  name?: unknown;
  email?: unknown;
  company?: unknown;
  scope?: unknown;
  message?: unknown;
  website?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value: unknown, max = 240) {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;',
  })[character] ?? character);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Inquiry;
    const name = text(payload.name, 120);
    const email = text(payload.email, 180);
    const company = text(payload.company, 160);
    const scope = text(payload.scope, 120);
    const message = text(payload.message, 4000);

    // Quietly accept bot submissions without forwarding them.
    if (text(payload.website, 80)) {
      return NextResponse.json({ success: true, delivered: false });
    }

    if (!name || !emailPattern.test(email) || !company || !message) {
      return NextResponse.json(
        { success: false, message: 'Please provide your name, work email, organization, and project context.' },
        { status: 400 },
      );
    }

    const apiKey = process.env.RESEND_API_KEY;
    const inbox = process.env.GHOSTHAND_INBOX;
    const from = process.env.GHOSTHAND_FROM;

    // Local previews and unconfigured deployments use the client-side mail fallback.
    if (!apiKey || !inbox || !from) {
      return NextResponse.json({ success: true, delivered: false });
    }

    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to: [inbox],
      replyTo: email,
      subject: `Ghosthand inquiry — ${company}`,
      html: `
        <h2>New Ghosthand inquiry</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Work email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Organization:</strong> ${escapeHtml(company)}</p>
        <p><strong>Engagement shape:</strong> ${escapeHtml(scope || 'Not specified')}</p>
        <p><strong>What is slowing down:</strong></p>
        <p>${escapeHtml(message).replace(/\n/g, '<br />')}</p>
      `,
    });

    if (error) {
      return NextResponse.json(
        { success: false, message: 'We could not deliver that inquiry right now. Please email hello@ghosthand.studios directly.' },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, delivered: true });
  } catch {
    return NextResponse.json(
      { success: false, message: 'We could not process that inquiry. Please email hello@ghosthand.studios directly.' },
      { status: 500 },
    );
  }
}
