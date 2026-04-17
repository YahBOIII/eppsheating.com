import nodemailer from "nodemailer";

const DEFAULT_TO_EMAIL = "EppsHeating@gmail.com";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function parseBody(body) {
  if (!body) return {};
  if (typeof body === "object") return body;
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return {};
    }
  }
  return {};
}

function sanitizeSingleLine(value) {
  return String(value || "")
    .replace(/[\u0000-\u001F\u007F]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function sanitizeMultiline(value) {
  return String(value || "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/\r/g, "")
    .trim();
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed." });
  }

  const data = parseBody(req.body);
  const name = sanitizeSingleLine(data.name);
  const phone = sanitizeSingleLine(data.phone);
  const email = sanitizeSingleLine(data.email);
  const service = sanitizeSingleLine(data.service);
  const address = sanitizeSingleLine(data.address);
  const description = sanitizeMultiline(data.description);
  const company = sanitizeSingleLine(data.company);

  if (company) {
    return res.status(400).json({ error: "Unable to submit request." });
  }

  if (!name || !phone || !email || !service || !description) {
    return res.status(400).json({ error: "Please complete all required fields." });
  }

  if (!EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
    return res.status(500).json({ error: "Email service is not configured." });
  }

  const host = process.env.SMTP_HOST || "smtp.gmail.com";
  const port = Number.parseInt(process.env.SMTP_PORT || "587", 10);
  const secure = process.env.SMTP_SECURE === "true";
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const to = process.env.SERVICE_REQUEST_TO || DEFAULT_TO_EMAIL;

  const transporter = nodemailer.createTransport({
    host,
    port: Number.isNaN(port) ? 587 : port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });

  const subject = `New Service Request: ${service}`;
  const text = [
    "New service request received.",
    "",
    `Name: ${name}`,
    `Phone: ${phone}`,
    `Email: ${email}`,
    `Service: ${service}`,
    `Address: ${address || "Not provided"}`,
    "",
    "Description:",
    description
  ].join("\n");

  const html = `
    <h2>New Service Request</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Service:</strong> ${escapeHtml(service)}</p>
    <p><strong>Address:</strong> ${escapeHtml(address || "Not provided")}</p>
    <p><strong>Description:</strong></p>
    <p>${escapeHtml(description).replace(/\n/g, "<br />")}</p>
  `;

  try {
    await transporter.sendMail({
      from,
      to,
      subject,
      text,
      html
    });

    return res.status(200).json({
      message: "Your request has been submitted. We’ll contact you soon."
    });
  } catch (error) {
    console.error("Service request email failed:", error);
    return res.status(500).json({ error: "Unable to submit your request right now." });
  }
}
