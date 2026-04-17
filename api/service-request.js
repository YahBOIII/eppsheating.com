import { Resend } from 'resend';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function normalize(value) {
  return typeof value === 'string' ? value.trim() : '';
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = typeof req.body === 'object' && req.body !== null ? req.body : {};
  const name = normalize(body.name);
  const phone = normalize(body.phone);
  const email = normalize(body.email);
  const service = normalize(body.service);
  const description = normalize(body.description);
  const address = normalize(body.address);
  const company = normalize(body.company);

  if (!name || !phone || !email || !service || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (company) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const resend = new Resend(resendApiKey);
    const fromAddress = process.env.SERVICE_REQUEST_FROM || 'Epp\'s Heating <onboarding@resend.dev>';
    const toAddress = process.env.SERVICE_REQUEST_TO || 'EppsHeating@gmail.com';
    const safeDescription = escapeHtml(description).replace(/\n/g, '<br>');

    await resend.emails.send({
      from: fromAddress,
      to: toAddress,
      subject: `New Service Request from ${name}`,
      replyTo: email,
      html: `<h2>New Service Request</h2><p><strong>Name:</strong> ${escapeHtml(name)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><p><strong>Service:</strong> ${escapeHtml(service)}</p><p><strong>Address:</strong> ${address ? escapeHtml(address) : 'Not provided'}</p><p><strong>Description:</strong></p><p>${safeDescription}</p>`
    });

    await resend.emails.send({
      from: fromAddress,
      to: email,
      subject: 'Service Request Received - Epp\'s Custom Heating & Air',
      html: `<h2>Thank You!</h2><p>Hi ${escapeHtml(name)},</p><p>We received your service request and will contact you as soon as possible to schedule service.</p><p><strong>Your Request Details:</strong></p><p><strong>Service Type:</strong> ${escapeHtml(service)}</p><p><strong>Phone:</strong> ${escapeHtml(phone)}</p><p>For urgent issues, please call us directly: <strong>(847) 516-8221</strong></p><p>Best regards,<br>Epp's Custom Heating & Air</p>`
    });

    res.status(200).json({ success: true, message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
}
