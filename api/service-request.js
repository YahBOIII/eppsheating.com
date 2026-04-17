const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

async function sendEmail(to, subject, html) {
    try {
        const response = await resend.sendEmail({
            to,
            subject,
            html,
        });
        console.log('Email sent successfully:', response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

module.exports = { sendEmail };