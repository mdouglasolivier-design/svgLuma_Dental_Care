import nodemailer from "nodemailer";

// Configure your email provider here
// For production, use Gmail, SendGrid, Mailgun, etc.
// For development, you can use Ethereal (ethereal.email) for testing

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.ethereal.email",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
  },
});

interface AppointmentEmailData {
  patientName: string;
  patientEmail: string;
  doctorName: string;
  serviceName: string;
  date: string;
  time: string;
  locationName: string;
  clinicName: string;
}

export async function sendAppointmentConfirmation(data: AppointmentEmailData) {
  const { patientName, patientEmail, doctorName, serviceName, date, time, locationName, clinicName } = data;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .header { background: linear-gradient(135deg, #0d9488, #0891b2); padding: 32px; text-align: center; }
    .header h1 { color: white; margin: 0; font-size: 24px; }
    .header p { color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; }
    .content { padding: 32px; }
    .greeting { font-size: 18px; color: #1e293b; margin-bottom: 16px; }
    .details { background: #f1f5f9; border-radius: 12px; padding: 20px; margin: 20px 0; }
    .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #64748b; font-size: 14px; }
    .detail-value { color: #1e293b; font-weight: 600; font-size: 14px; }
    .note { background: #ecfdf5; border-left: 4px solid #10b981; padding: 12px 16px; margin: 20px 0; border-radius: 0 8px 8px 0; }
    .note p { color: #065f46; margin: 0; font-size: 14px; }
    .footer { padding: 20px 32px; background: #f8fafc; text-align: center; color: #94a3b8; font-size: 12px; }
    .btn { display: inline-block; background: #0d9488; color: white; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; margin: 16px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🦷 ${clinicName}</h1>
      <p>Appointment Confirmation</p>
    </div>
    <div class="content">
      <p class="greeting">Hi ${patientName},</p>
      <p style="color: #475569; line-height: 1.6;">
        Your appointment has been <strong style="color: #0d9488;">confirmed</strong>! We look forward to seeing you.
      </p>
      
      <div class="details">
        <div class="detail-row">
          <span class="detail-label">📋 Service</span>
          <span class="detail-value">${serviceName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">👨‍⚕️ Doctor</span>
          <span class="detail-value">${doctorName}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📅 Date</span>
          <span class="detail-value">${date}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">🕐 Time</span>
          <span class="detail-value">${time}</span>
        </div>
        <div class="detail-row">
          <span class="detail-label">📍 Location</span>
          <span class="detail-value">${locationName}</span>
        </div>
      </div>

      <div class="note">
        <p>💡 <strong>Please arrive 15 minutes before your appointment.</strong> Bring your ID and insurance card if applicable.</p>
      </div>

      <p style="color: #475569; line-height: 1.6; font-size: 14px;">
        If you need to reschedule or cancel, please call us at least 24 hours in advance.
      </p>
    </div>
    <div class="footer">
      <p>This is an automated confirmation from ${clinicName}.</p>
      <p>If you have questions, please contact us directly.</p>
    </div>
  </div>
</body>
</html>
`;

  try {
    // Only send if SMTP is configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.log("[Email] SMTP not configured. Appointment confirmation logged for:", patientEmail);
      console.log("[Email] To enable email, set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in .env");
      return { sent: false, reason: "SMTP not configured" };
    }

    const info = await transporter.sendMail({
      from: `"${clinicName}" <${process.env.SMTP_USER}>`,
      to: patientEmail,
      subject: `✅ Appointment Confirmed - ${serviceName} on ${date}`,
      html: htmlContent,
    });

    console.log("[Email] Confirmation sent:", info.messageId);
    return { sent: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email] Failed to send:", error);
    return { sent: false, error: String(error) };
  }
}
