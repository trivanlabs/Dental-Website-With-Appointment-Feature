const nodemailer = require('nodemailer');

// Create the transporter using SMTP environment variables
const createTransporter = () => {
  // If SMTP config is missing, return a dummy transporter that logs to console
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn('⚠️ SMTP credentials missing from environment variables. Email service will run in log-only mode.');
    return {
      sendMail: async (options) => {
        console.log('📬 [EMAIL MOCK] Sending email:', {
          to: options.to,
          subject: options.subject,
          text: options.text
        });
        return { messageId: 'mock-id' };
      }
    };
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const transporter = createTransporter();

// Helper to format date in a readable format
const formatDate = (dateStr) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

// Base layout HTML template wrapper
const getHtmlWrapper = (title, content) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: 'Segoe UI', Helvetica, Arial, sans-serif; color: #1e293b;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); overflow: hidden; border: 1px solid #e2e8f0;">
        <!-- Header -->
        <tr>
          <td style="padding: 40px 30px; background: linear-gradient(135deg, #1a3a4a 0%, #2d5a6b 100%); text-align: center;">
            <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 700; letter-spacing: 0.5px;">Shiv Shakti Dental Clinic</h1>
            <p style="margin: 5px 0 0 0; color: #e2e8f0; font-size: 14px;">Dr. Hetvish Ahalpara & Team</p>
          </td>
        </tr>
        <!-- Content -->
        <tr>
          <td style="padding: 40px 30px;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="padding: 30px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 13px; color: #64748b;">
            <p style="margin: 0 0 8px 0; font-weight: 600; color: #475569;">🏥 Shiv Shakti Dental Clinic</p>
            <p style="margin: 0 0 8px 0;">102-105, Royal Plaza, Near Station Road, Surat, Gujarat</p>
            <p style="margin: 0 0 16px 0;">📞 Call Us: +91 93132 88482</p>
            <hr style="border: 0; border-top: 1px solid #cbd5e1; margin: 16px 0;">
            <p style="margin: 0; font-size: 11px; line-height: 1.4;">This is an automated message regarding your appointment. Please do not reply directly to this email.</p>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

// 1. Patient Notification: Appointment Received (Pending Approval)
const getPendingTemplate = (appointment) => {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 20px; font-weight: 600;">Appointment Request Received</h2>
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
      Hi <strong>${appointment.patientName}</strong>,<br><br>
      Thank you for choosing Shiv Shakti Dental Clinic. We have received your appointment request, and it is currently <strong>pending confirmation</strong> from Dr. Hetvish Ahalpara.
    </p>
    
    <!-- Details Card -->
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px;">Appointment Details</h3>
          <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #334155;">
            <tr style="height: 32px;">
              <td style="width: 100px; font-weight: 600; color: #475569;">Date</td>
              <td>${formatDate(appointment.date)}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600; color: #475569;">Time Slot</td>
              <td>${appointment.timeSlot}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600; color: #475569;">Status</td>
              <td>
                <span style="background-color: #fef3c7; color: #d97706; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; border: 1px solid #fde68a;">
                  Pending Approval
                </span>
              </td>
            </tr>
            ${appointment.concern ? `
            <tr style="height: 32px;">
              <td style="vertical-align: top; padding-top: 8px; font-weight: 600; color: #475569;">Concern</td>
              <td style="padding-top: 8px; font-style: italic;">"${appointment.concern}"</td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
      Once our team reviews your request, we will send you a final confirmation email. If you need to make changes or cancel, please call us at +91 93132 88482.
    </p>
  `;
  return getHtmlWrapper('Appointment Request Received', content);
};

// 2. Patient Notification: Appointment Confirmed
const getConfirmedTemplate = (appointment) => {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: #166534; font-size: 20px; font-weight: 600; display: flex; align-items: center;">
      ✓ Appointment Confirmed!
    </h2>
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
      Hi <strong>${appointment.patientName}</strong>,<br><br>
      Great news! Your appointment has been <strong>confirmed</strong>. We look forward to seeing you at our clinic.
    </p>
    
    <!-- Details Card -->
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #166534; letter-spacing: 0.5px;">Appointment Details</h3>
          <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #14532d;">
            <tr style="height: 32px;">
              <td style="width: 100px; font-weight: 600;">Date</td>
              <td>${formatDate(appointment.date)}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Time Slot</td>
              <td>${appointment.timeSlot}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Status</td>
              <td>
                <span style="background-color: #dcfce7; color: #15803d; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; border: 1px solid #86efac;">
                  Confirmed
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>

    <!-- Clinic Guidelines -->
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px; font-size: 14px; line-height: 1.6; color: #475569;">
          <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: 700; color: #1e293b;">📌 Important Guidelines</h3>
          <ul style="margin: 0; padding-left: 20px; color: #475569;">
            <li style="margin-bottom: 6px;">Please arrive <strong>10 minutes prior</strong> to your scheduled appointment time.</li>
            <li style="margin-bottom: 6px;">Bring any current dental reports or details of your ongoing medications.</li>
            <li style="margin-bottom: 0;">If you are experiencing any cold/flu-like symptoms, please notify us to reschedule.</li>
          </ul>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
      If you need to reschedule or have any questions, please contact us immediately at +91 93132 88482.
    </p>
  `;
  return getHtmlWrapper('Appointment Confirmed', content);
};

// 3. Patient Notification: Appointment Cancelled
const getCancelledTemplate = (appointment) => {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: #991b1b; font-size: 20px; font-weight: 600;">Appointment Cancelled</h2>
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
      Hi <strong>${appointment.patientName}</strong>,<br><br>
      This email is to notify you that your appointment scheduled for <strong>${formatDate(appointment.date)}</strong> at <strong>${appointment.timeSlot}</strong> has been <strong>cancelled</strong>.
    </p>
    
    <!-- Details Card -->
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #991b1b; letter-spacing: 0.5px;">Appointment Details</h3>
          <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #7f1d1d;">
            <tr style="height: 32px;">
              <td style="width: 100px; font-weight: 600;">Date</td>
              <td style="text-decoration: line-through;">${formatDate(appointment.date)}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Time Slot</td>
              <td style="text-decoration: line-through;">${appointment.timeSlot}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Status</td>
              <td>
                <span style="background-color: #fee2e2; color: #991b1b; padding: 4px 8px; border-radius: 6px; font-size: 12px; font-weight: 700; border: 1px solid #fecaca;">
                  Cancelled
                </span>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
    
    <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #64748b;">
      If this was an error or you would like to book a new appointment, you can visit our booking portal or call us at +91 93132 88482.
    </p>
  `;
  return getHtmlWrapper('Appointment Cancelled', content);
};

// 4. Admin Notification: New Booking Alert
const getAdminNotificationTemplate = (appointment) => {
  const content = `
    <h2 style="margin: 0 0 16px 0; color: #1e3a8a; font-size: 20px; font-weight: 600;">New Appointment Request</h2>
    <p style="margin: 0 0 24px 0; font-size: 15px; line-height: 1.6; color: #475569;">
      A new appointment request has been submitted by a patient. Please log into the dashboard to review and approve.
    </p>
    
    <!-- Details Card -->
    <table cellpadding="0" cellspacing="0" width="100%" style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; margin-bottom: 24px;">
      <tr>
        <td style="padding: 20px;">
          <h3 style="margin: 0 0 12px 0; font-size: 14px; text-transform: uppercase; color: #1e3a8a; letter-spacing: 0.5px;">Request Details</h3>
          <table cellpadding="0" cellspacing="0" width="100%" style="font-size: 14px; color: #1e3a8a;">
            <tr style="height: 32px;">
              <td style="width: 110px; font-weight: 600;">Patient Name</td>
              <td style="color: #0f172a;">${appointment.patientName}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Email</td>
              <td style="color: #0f172a;">${appointment.email}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Mobile</td>
              <td style="color: #0f172a;">${appointment.mobile}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Date</td>
              <td style="color: #0f172a;">${formatDate(appointment.date)}</td>
            </tr>
            <tr style="height: 32px;">
              <td style="font-weight: 600;">Time Slot</td>
              <td style="color: #0f172a;">${appointment.timeSlot}</td>
            </tr>
            ${appointment.concern ? `
            <tr style="height: 32px;">
              <td style="vertical-align: top; padding-top: 8px; font-weight: 600;">Concern</td>
              <td style="padding-top: 8px; color: #0f172a; font-style: italic;">"${appointment.concern}"</td>
            </tr>
            ` : ''}
          </table>
        </td>
      </tr>
    </table>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="https://dental-website-with-appointment-fea.vercel.app/doctor/dashboard" style="background-color: #1a3a4a; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; display: inline-block;">
        Go to Doctor Dashboard
      </a>
    </div>
  `;
  return getHtmlWrapper('New Appointment Request', content);
};

// ─── Exports ──────────────────────────────────────────────────────────

/**
 * Send booking request notification to the patient
 */
exports.sendPatientPendingEmail = async (appointment) => {
  const mailOptions = {
    from: `"Shiv Shakti Dental Clinic" <${process.env.SMTP_USER}>`,
    to: appointment.email,
    subject: 'Appointment Request Received - Shiv Shakti Dental Clinic',
    html: getPendingTemplate(appointment),
    text: `Hi ${appointment.patientName},\n\nWe have received your appointment request for ${formatDate(appointment.date)} at ${appointment.timeSlot}. It is pending confirmation. We will email you once confirmed.\n\nShiv Shakti Dental Clinic`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Pending email sent to patient:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send pending email to patient:', error.message);
  }
};

/**
 * Send confirmation email to the patient
 */
exports.sendPatientConfirmedEmail = async (appointment) => {
  const mailOptions = {
    from: `"Shiv Shakti Dental Clinic" <${process.env.SMTP_USER}>`,
    to: appointment.email,
    subject: 'Appointment CONFIRMED - Shiv Shakti Dental Clinic',
    html: getConfirmedTemplate(appointment),
    text: `Hi ${appointment.patientName},\n\nYour appointment at Shiv Shakti Dental Clinic on ${formatDate(appointment.date)} at ${appointment.timeSlot} has been confirmed. Please arrive 10 minutes prior.\n\nShiv Shakti Dental Clinic`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Confirmation email sent to patient:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send confirmation email to patient:', error.message);
  }
};

/**
 * Send cancellation email to the patient
 */
exports.sendPatientCancelledEmail = async (appointment) => {
  const mailOptions = {
    from: `"Shiv Shakti Dental Clinic" <${process.env.SMTP_USER}>`,
    to: appointment.email,
    subject: 'Appointment Cancelled - Shiv Shakti Dental Clinic',
    html: getCancelledTemplate(appointment),
    text: `Hi ${appointment.patientName},\n\nYour appointment scheduled for ${formatDate(appointment.date)} at ${appointment.timeSlot} has been cancelled.\n\nShiv Shakti Dental Clinic`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Cancellation email sent to patient:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send cancellation email to patient:', error.message);
  }
};

/**
 * Send email notification to doctor about a new booking request
 */
exports.sendAdminAlertEmail = async (appointment) => {
  const recipient = process.env.CLINIC_NOTIFICATION_EMAIL || process.env.SMTP_USER;
  if (!recipient) return;

  const mailOptions = {
    from: `"Shiv Shakti Dental Notification" <${process.env.SMTP_USER}>`,
    to: recipient,
    subject: `New Request: ${appointment.patientName} - ${appointment.timeSlot}`,
    html: getAdminNotificationTemplate(appointment),
    text: `New Appointment Request:\n\nPatient: ${appointment.patientName}\nEmail: ${appointment.email}\nMobile: ${appointment.mobile}\nDate: ${formatDate(appointment.date)}\nTime Slot: ${appointment.timeSlot}\nConcern: ${appointment.concern || 'None'}\n\nPlease review in Doctor Dashboard.`
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Alert email sent to admin:', info.messageId);
    return info;
  } catch (error) {
    console.error('❌ Failed to send alert email to admin:', error.message);
  }
};
