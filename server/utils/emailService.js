import nodemailer from "nodemailer";

// For Gmail in development; for production use SendGrid/Mailgun etc.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email
    pass: process.env.EMAIL_PASS, // your password or app password
  },
});

export async function sendOrderReceipt(to, subject, text, pdfPath) {
  return transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
    attachments: [
      {
        filename: "receipt.pdf",
        path: pdfPath,
      },
    ],
  });
}
