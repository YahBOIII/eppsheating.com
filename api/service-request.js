import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, email, service, description, address } = req.body;

  if (!name || !phone || !email || !service || !description) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD
      }
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: 'EppsHeating@gmail.com',
      subject: `New Service Request from ${name}`,
      html: `<h2>New Service Request</h2><p><strong>Name:</strong> ${name}</p><p><strong>Phone:</strong> ${phone}</p><p><strong>Email:</strong> ${email}</p><p><strong>Service:</strong> ${service}</p><p><strong>Address:</strong> ${address || 'Not provided'}</p><p><strong>Description:</strong></p><p>${description.replace(/\n/g, '<br>')}</p>`
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: 'Service Request Received - Epp\'s Custom Heating & Air',
      html: `<h2>Thank You!</h2><p>Hi ${name},</p><p>We received your service request and will contact you within 24 hours to schedule service.</p><p><strong>Your Request Details:</strong></p><p><strong>Service Type:</strong> ${service}</p><p><strong>Phone:</strong> ${phone}</p><p>For urgent issues, please call us directly: <strong>(847) 516-8221</strong></p><p>Best regards,<br>Epp's Custom Heating & Air Team</p>`
    });

    res.status(200).json({ success: true, message: 'Request submitted successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ error: 'Failed to submit request' });
  }
}