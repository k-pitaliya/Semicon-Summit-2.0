const { google } = require('googleapis');

// Strip any surrounding quotes from env vars (common .env mistake)
const clean = (v) => (v || '').replace(/^"|"$/g, '').trim();

const EMAIL_USER = clean(process.env.EMAIL_USER);
const GMAIL_CLIENT_ID = clean(process.env.GMAIL_CLIENT_ID);
const GMAIL_CLIENT_SECRET = clean(process.env.GMAIL_CLIENT_SECRET);
const GMAIL_REFRESH_TOKEN = clean(process.env.GMAIL_REFRESH_TOKEN);

// ── Logo URL — served from the production frontend ─────────────────────────
const LOGO_URL = `${process.env.FRONTEND_URL || 'https://semisummit2026.charusat.ac.in'}/images/Logo/Logo%20of%20SS.png`;
const LOGIN_URL = `${process.env.FRONTEND_URL || 'https://semisummit2026.charusat.ac.in'}/login`;

// ── OAuth2 client ───────────────────────────────────────────────────────────
const oAuth2Client = new google.auth.OAuth2(
  GMAIL_CLIENT_ID,
  GMAIL_CLIENT_SECRET,
  'https://developers.google.com/oauthplayground'
);
if (GMAIL_REFRESH_TOKEN) {
  oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
}
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// ── RFC 2047 — encode non-ASCII subjects so they don't garble ───────────────
const encodeSubject = (s) =>
  /^[\x00-\x7F]*$/.test(s) ? s : `=?UTF-8?B?${Buffer.from(s).toString('base64')}?=`;

// ── Build raw RFC-2822 email and base64url-encode it ────────────────────────
// HTML body is base64-encoded (most reliable with Gmail API — prevents styling strip)
const buildRawEmail = ({ to, subject, html }) => {
  const boundary = `----=_Part_${Date.now()}`;
  // Encode HTML as base64, split into 76-char lines per RFC 2045
  const htmlBase64 = Buffer.from(html, 'utf-8').toString('base64').replace(/(.{76})/g, '$1\r\n');
  const raw = [
    `From: "Semiconductor Summit 2.0" <${EMAIL_USER}>`,
    `To: ${to}`,
    `Subject: ${encodeSubject(subject)}`,
    `MIME-Version: 1.0`,
    `Content-Type: multipart/alternative; boundary="${boundary}"`,
    ``,
    `--${boundary}`,
    `Content-Type: text/html; charset=UTF-8`,
    `Content-Transfer-Encoding: base64`,
    ``,
    htmlBase64,
    ``,
    `--${boundary}--`,
  ].join('\r\n');
  return Buffer.from(raw).toString('base64url');
};

// ── Send via Gmail API ──────────────────────────────────────────────────────
const sendMail = async ({ to, subject, html }) => {
  const raw = buildRawEmail({ to, subject, html });
  try {
    return await gmail.users.messages.send({ userId: 'me', requestBody: { raw } });
  } catch (err) {
    const gErr = err.response?.data?.error;
    if (gErr) {
      console.error(`❌ Gmail API error [${gErr.code}]: ${gErr.message}`);
      if (gErr.errors) console.error('   Details:', JSON.stringify(gErr.errors));
    } else {
      console.error(`❌ Gmail send error: ${err.message}`);
    }
    throw err;
  }
};

// ── Retry wrapper — up to 3 attempts with exponential back-off ───────────────
// Delays: 1 s → 2 s → 4 s  (covers transient Gmail API / network blips)
const sendWithRetry = async (mailOpts, maxAttempts = 3) => {
  let lastErr;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await sendMail(mailOpts);
      return true; // success
    } catch (err) {
      lastErr = err;
      if (attempt < maxAttempts) {
        const delay = Math.pow(2, attempt - 1) * 1000; // 1000, 2000, 4000 ms
        console.warn(`⚠️  Email attempt ${attempt}/${maxAttempts} failed — retrying in ${delay / 1000}s…`);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  console.error(`❌ Email failed after ${maxAttempts} attempts: ${lastErr?.message}`);
  return false; // all attempts exhausted
};


// ── Shared base template (table-based for email client compat) ─────────────
// accentColor: top accent bar color  |  headerBg: header background
const baseTemplate = ({ accentColor, contentHtml }) => `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>Semiconductor Summit 2.0</title>
  <style type="text/css">
    /* Reset */
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; background-color: #f0f2f5; }

    /* Mobile */
    @media screen and (max-width: 600px) {
      .wrapper { width: 100% !important; max-width: 100% !important; }
      .inner-td { padding: 28px 20px !important; }
      .cta-btn { padding: 14px 28px !important; font-size: 15px !important; }
      .credential-val { font-size: 15px !important; }
      .logo-img { width: 72px !important; height: 72px !important; }
      .header-td { padding: 28px 20px 20px !important; }
      .event-tag { font-size: 12px !important; padding: 5px 10px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f0f2f5;">
  <!-- Outer wrapper -->
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="background-color:#f0f2f5;">
    <tr>
      <td align="center" style="padding:32px 12px;">

        <!-- Email card -->
        <table border="0" cellpadding="0" cellspacing="0" width="600" class="wrapper"
          style="max-width:600px;width:100%;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.10);">

          <!-- Top accent bar -->
          <tr>
            <td height="5" style="background:${accentColor};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Header: dark circuit-board look -->
          <tr>
            <td align="center" class="header-td"
              style="background:linear-gradient(135deg,#0a0f1e 0%,#111827 60%,#0d1a2e 100%);padding:36px 24px 28px;">
              <!-- Logo image -->
              <table border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center">
                    <img src="${LOGO_URL}" alt="SS" width="88" height="88" class="logo-img"
                      style="width:88px;height:88px;object-fit:contain;border-radius:12px;display:block;margin:0 auto 14px;" />
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <p style="margin:0;font-family:Arial,sans-serif;font-size:18px;font-weight:700;
                      color:#ffffff;letter-spacing:0.06em;text-transform:uppercase;line-height:1.2;">
                      Semiconductor Summit
                      <span style="color:${accentColor};">&nbsp;2.0</span>
                    </p>
                    <p style="margin:4px 0 0;font-family:Arial,sans-serif;font-size:11px;
                      color:#64748b;letter-spacing:0.14em;text-transform:uppercase;">
                      CHARUSAT University &nbsp;|&nbsp; March 2026
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Thin accent divider -->
          <tr>
            <td height="3" style="background:linear-gradient(90deg,transparent,${accentColor},transparent);font-size:0;line-height:0;">&nbsp;</td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="inner-td" style="padding:36px 40px;background:#ffffff;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:24px 40px;text-align:center;">
              <p style="margin:0 0 6px;font-family:Arial,sans-serif;font-size:12px;color:#94a3b8;">
                This email was sent by the Semiconductor Summit 2.0 team.
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#cbd5e1;">
                Electronics &amp; Communication Dept &nbsp;&bull;&nbsp; CHARUSAT University, Changa, Gujarat
              </p>
            </td>
          </tr>

          <!-- Bottom accent bar -->
          <tr>
            <td height="4" style="background:${accentColor};font-size:0;line-height:0;">&nbsp;</td>
          </tr>

        </table>
        <!-- /Email card -->

      </td>
    </tr>
  </table>
</body>
</html>
`;

// ── Reusable HTML snippets ──────────────────────────────────────────────────
const credentialBox = (label, value, mono = true) => `
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom:12px;">
    <tr>
      <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
        <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:600;
          color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">${label}</p>
        <p class="credential-val" style="margin:0;font-family:${mono ? "'Courier New',Courier,monospace" : 'Arial,sans-serif'};
          font-size:17px;font-weight:700;color:#0f172a;word-break:break-all;">${value}</p>
      </td>
    </tr>
  </table>`;

const ctaButton = (href, label, bg = '#2563eb') => `
  <table border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin:0 auto;">
    <tr>
      <td align="center" style="border-radius:8px;background:${bg};">
        <a href="${href}" class="cta-btn" target="_blank"
          style="display:inline-block;padding:15px 36px;font-family:Arial,sans-serif;font-size:16px;
          font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.02em;border-radius:8px;">
          ${label}
        </a>
      </td>
    </tr>
  </table>`;

const sectionCard = (headerLabel, bodyHtml, accentColor = '#2563eb') => `
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation"
    style="margin-bottom:28px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
    <tr>
      <td style="padding:10px 16px;background:#f1f5f9;border-bottom:1px solid #e2e8f0;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;font-weight:700;
          color:${accentColor};text-transform:uppercase;letter-spacing:0.1em;">${headerLabel}</p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 16px;">
        ${bodyHtml}
      </td>
    </tr>
  </table>`;

const greeting = (name) =>
  `<h2 style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:22px;font-weight:700;color:#0f172a;">
      Hello, ${name}!
    </h2>`;

const bodyText = (text) =>
  `<p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:15px;line-height:1.7;color:#475569;">${text}</p>`;

const warningNote = (text) => `
  <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-top:24px;">
    <tr>
      <td style="padding:14px 16px;background:#fffbeb;border:1px solid #fde68a;border-radius:8px;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#92400e;line-height:1.6;">
          ${text}
        </p>
      </td>
    </tr>
  </table>`;

// ── Generate password ───────────────────────────────────────────────────────
const generatePassword = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
  let pw = '';
  for (let i = 0; i < 8; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
};

// ── Verify Gmail API ────────────────────────────────────────────────────────
const verifyEmailTransporter = async () => {
  if (!EMAIL_USER || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
    console.warn('⚠️  Gmail API credentials incomplete — emails will NOT be sent');
    return false;
  }
  try {
    const { token } = await oAuth2Client.getAccessToken();
    console.log(`✅ Gmail API ready — sending as ${EMAIL_USER}`);
    console.log(`   → Access token obtained: ${token ? 'yes' : 'no'}`);
    return true;
  } catch (err) {
    console.error(`❌ Gmail API auth failed: ${err.message}`);
    return false;
  }
};

// ══════════════════════════════════════════════════════════════════════════════
//  1. CREDENTIALS EMAIL  (sent after registration approval)
// ══════════════════════════════════════════════════════════════════════════════
const sendCredentialsEmail = async (user, password) => {
  // Build event tags
  const ec = user.eventChoices || {};
  const tags = [];
  if (ec.panelDiscussion) tags.push('Inaugural Talk &amp; Panel Discussion');
  if (ec.day1Workshop === 'rtl-gds') tags.push('RTL to GDS II Workshop');
  else if (ec.day1Workshop === 'fpga') tags.push('FPGA Interfacing Workshop');
  if (ec.expertInsights) tags.push('Expert Insights: VLSI vs Embedded');
  if (ec.sharkTank) tags.push('Silicon Shark Tank');
  if (ec.aiInVlsi) tags.push('Impact of AI in VLSI');
  if (ec.treasureHunt) tags.push('Silicon Jackpot');
  if (ec.silentGallery) tags.push('Silicon Ideas Gallery');
  if (tags.length === 0 && user.selectedEvents?.length > 0) {
    user.selectedEvents.forEach(e => tags.push(e));
  }
  const tagHtml = tags.length > 0
    ? tags.map(t => `<span class="event-tag" style="display:inline-block;margin:4px 4px 0 0;padding:6px 12px;background:#eff6ff;color:#1d4ed8;border:1px solid #bfdbfe;border-radius:99px;font-family:Arial,sans-serif;font-size:13px;font-weight:500;">${t}</span>`).join('')
    : `<span style="font-family:Arial,sans-serif;font-size:14px;color:#94a3b8;">Standard Access — All General Sessions</span>`;

  const contentHtml = `
      ${greeting(user.name)}
      ${bodyText('Your registration for <strong>Semiconductor Summit 2.0</strong> has been verified. Your participant account is now active — use the credentials below to sign in.')}

      ${sectionCard('Your Login Credentials', `
        ${credentialBox('Email / Username', user.email)}
        ${credentialBox('Temporary Password', password)}
      `, '#2563eb')}

      ${sectionCard('Your Registered Events', `
        <div style="line-height:2;">${tagHtml}</div>
      `, '#059669')}

      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom:28px;">
        <tr><td align="center">${ctaButton(LOGIN_URL, 'Go to Participant Dashboard', '#2563eb')}</td></tr>
      </table>

      ${warningNote('&#128274;&nbsp; <strong>Security Notice:</strong> Please change your password immediately after your first login. This is a temporary password generated for your account.')}
    `;

  const html = baseTemplate({ accentColor: '#2563eb', contentHtml });

  const sent = await sendWithRetry({
    to: user.email,
    subject: 'Your Semiconductor Summit 2.0 Login Credentials',
    html
  });
  if (sent) {
    console.log(`✅ Credentials email sent to ${user.email}`);
  } else {
    console.error(`❌ Credentials email failed for ${user.email} after all retries`);
  }
  return sent;
};

// ══════════════════════════════════════════════════════════════════════════════
//  2. REJECTION EMAIL
// ══════════════════════════════════════════════════════════════════════════════
const sendRejectionEmail = async (user, reason) => {
  const contentHtml = `
      ${greeting(user.name)}
      ${bodyText('Thank you for registering for <strong>Semiconductor Summit 2.0</strong>. Unfortunately, we were unable to verify your payment details and could not activate your account at this time.')}

      ${sectionCard('Reason for Rejection', `
        <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#991b1b;line-height:1.7;">
          ${reason || 'Payment verification failed. Please ensure the Razorpay Payment ID is correct and the receipt is valid.'}
        </p>
      `, '#ef4444')}

      ${bodyText('If you believe this is a mistake, or if you have a valid payment receipt, please register again with the correct payment details or contact our support team.')}

      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom:28px;">
        <tr><td align="center">${ctaButton(`${process.env.FRONTEND_URL || 'https://semisummit2026.charusat.ac.in'}/register`, 'Register Again', '#ef4444')}</td></tr>
      </table>

      ${warningNote('Need help? Contact us at <strong>semisummit.ec@charusat.ac.in</strong> with your payment receipt and we will resolve this promptly.')}
    `;

  const html = baseTemplate({ accentColor: '#ef4444', contentHtml });

  const sent = await sendWithRetry({
    to: user.email,
    subject: 'Semiconductor Summit 2.0 - Registration Status Update',
    html
  });
  if (sent) console.log(`✅ Rejection email sent to ${user.email}`);
  else console.error(`❌ Rejection email failed for ${user.email}`);
  return sent;
};

// ══════════════════════════════════════════════════════════════════════════════
//  3. PASSWORD RESET EMAIL
// ══════════════════════════════════════════════════════════════════════════════
const sendPasswordResetEmail = async (user, newPassword) => {
  const contentHtml = `
      ${greeting(user.name)}
      ${bodyText('Your password for <strong>Semiconductor Summit 2.0</strong> has been reset. Use the new credentials below to sign in to your participant dashboard.')}

      ${sectionCard('New Login Credentials', `
        ${credentialBox('Email / Username', user.email)}
        ${credentialBox('New Temporary Password', newPassword)}
      `, '#7c3aed')}

      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom:28px;">
        <tr><td align="center">${ctaButton(LOGIN_URL, 'Sign In Now', '#7c3aed')}</td></tr>
      </table>

      ${warningNote('&#128274;&nbsp; <strong>Didn\'t request this?</strong> If you did not request a password reset, please contact our team at <strong>semisummit.ec@charusat.ac.in</strong> immediately. Change your password after login.')}
    `;

  const html = baseTemplate({ accentColor: '#7c3aed', contentHtml });

  const sent = await sendWithRetry({
    to: user.email,
    subject: 'Semiconductor Summit 2.0 - Your Password Has Been Reset',
    html
  });
  if (sent) console.log(`✅ Password reset email sent to ${user.email}`);
  else console.error(`❌ Password reset email failed for ${user.email}`);
  return sent;
};

// ══════════════════════════════════════════════════════════════════════════════
//  4. PASSWORD CHANGED CONFIRMATION EMAIL
//  Sent after a user resets their own password via the Forgot Password flow.
//  Does NOT include the new password \u2014 it\u2019s a security notification only.
// ══════════════════════════════════════════════════════════════════════════════
const sendPasswordChangedEmail = async (user) => {
  const contentHtml = `
      ${greeting(user.name)}
      ${bodyText('Your password for <strong>Semiconductor Summit 2.0</strong> has been successfully changed. You can now sign in with your new password.')}

      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom:28px;">
        <tr><td align="center">${ctaButton(LOGIN_URL, 'Sign In Now', '#7c3aed')}</td></tr>
      </table>

      ${warningNote('&#128274;&nbsp; <strong>Didn\'t request this change?</strong> If you did not reset your password, please contact us at <strong>semisummit.ec@charusat.ac.in</strong> immediately.')}
    `;

  const html = baseTemplate({ accentColor: '#7c3aed', contentHtml });

  const sent = await sendWithRetry({
    to: user.email,
    subject: 'Semiconductor Summit 2.0 \u2014 Password Changed Successfully',
    html
  });
  if (sent) console.log(`\u2705 Password-changed confirmation email sent to ${user.email}`);
  else console.error(`\u274c Password-changed email failed for ${user.email}`);
  return sent;
};

// ══════════════════════════════════════════════════════════════════════════════
//  5. ANNOUNCEMENT EMAIL
//  Sends an announcement blast to one recipient. Caller is responsible for
//  iterating over all target users and calling this once per recipient.
// ══════════════════════════════════════════════════════════════════════════════
const sendAnnouncementEmail = async (user, { title, content, targetEvent }) => {
  const audienceNote = targetEvent
    ? `<p style="margin:0 0 12px;font-family:Arial,sans-serif;font-size:13px;
        color:#94a3b8;">This message is for participants registered for: <strong style="color:#a78bfa;">${targetEvent}</strong></p>`
    : '';

  const contentHtml = `
      ${greeting(user.name)}
      ${audienceNote}
      ${bodyText(`You have a new announcement from <strong>Semiconductor Summit 2.0</strong>:`)}

      ${sectionCard(title, `
        <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
          <tr>
            <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
              <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#0f172a;
                line-height:1.7;white-space:pre-wrap;">${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
            </td>
          </tr>
        </table>
      `, '#22c55e')}

      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation" style="margin-bottom:28px;">
        <tr><td align="center">${ctaButton(LOGIN_URL, 'View Dashboard', '#22c55e')}</td></tr>
      </table>
    `;

  const html = baseTemplate({ accentColor: '#22c55e', contentHtml });

  return sendWithRetry({
    to: user.email,
    subject: `[SS 2.0] ${title}`,
    html
  });
};

// ── Contact Form Email ──────────────────────────────────────────────────────
// Sends an email to the summit team whenever someone submits the contact form.
const sendContactEmail = async ({ name, email, subject, message }) => {
  const contentHtml = `
    <h2 style="margin:0 0 8px;font-family:Arial,sans-serif;font-size:20px;font-weight:700;color:#0f172a;">
      📩 New Contact Form Submission
    </h2>
    <p style="margin:0 0 24px;font-family:Arial,sans-serif;font-size:14px;color:#64748b;">
      Someone submitted the contact form on the Semiconductor Summit 2.0 website.
    </p>

    ${sectionCard('Sender Details', `
      ${credentialBox('Name', name, false)}
      ${credentialBox('Email', email, false)}
    `, '#22c55e')}

    ${sectionCard('Message', `
      ${credentialBox('Subject', subject, false)}
      <table border="0" cellpadding="0" cellspacing="0" width="100%" role="presentation">
        <tr>
          <td style="padding:14px 16px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;">
            <p style="margin:0 0 4px;font-family:Arial,sans-serif;font-size:11px;font-weight:600;
              color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Message</p>
            <p style="margin:0;font-family:Arial,sans-serif;font-size:15px;color:#0f172a;
              line-height:1.6;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
          </td>
        </tr>
      </table>
    `, '#22c55e')}

    <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#94a3b8;text-align:center;">
      Reply directly to <strong>${email}</strong> to respond to this inquiry.
    </p>
  `;

  const html = baseTemplate({ accentColor: '#22c55e', contentHtml });

  const sent = await sendWithRetry({
    to: EMAIL_USER,
    subject: `[Semicon Summit] Contact: ${subject}`,
    html
  });
  if (sent) console.log(`✅ Contact form email received from ${email}`);
  else console.error(`❌ Contact email failed from ${email}`);
  return sent;
};

module.exports = {
  generatePassword,
  sendCredentialsEmail,
  sendRejectionEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendContactEmail,
  sendAnnouncementEmail,
  verifyEmailTransporter
};
