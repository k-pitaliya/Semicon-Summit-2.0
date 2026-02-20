const { google } = require('googleapis');

// Strip any surrounding quotes from env vars (common .env mistake)
const clean = (v) => (v || '').replace(/^"|"$/g, '').trim();

const EMAIL_USER = clean(process.env.EMAIL_USER);
const GMAIL_CLIENT_ID = clean(process.env.GMAIL_CLIENT_ID);
const GMAIL_CLIENT_SECRET = clean(process.env.GMAIL_CLIENT_SECRET);
const GMAIL_REFRESH_TOKEN = clean(process.env.GMAIL_REFRESH_TOKEN);

// Build OAuth2 client — Gmail API sends over HTTPS (no SMTP sockets)
const oAuth2Client = new google.auth.OAuth2(
    GMAIL_CLIENT_ID,
    GMAIL_CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'   // redirect used during token generation
);

if (GMAIL_REFRESH_TOKEN) {
    oAuth2Client.setCredentials({ refresh_token: GMAIL_REFRESH_TOKEN });
}

const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

// Helper — build a raw RFC-2822 message and base64url-encode it
const buildRawEmail = ({ to, subject, html }) => {
    const boundary = `----=_Part_${Date.now()}`;
    const lines = [
        `From: "Semiconductor Summit 2.0" <${EMAIL_USER}>`,
        `To: ${to}`,
        `Subject: ${subject}`,
        `MIME-Version: 1.0`,
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        ``,
        `--${boundary}`,
        `Content-Type: text/html; charset=UTF-8`,
        `Content-Transfer-Encoding: 7bit`,
        ``,
        html,
        ``,
        `--${boundary}--`,
    ];
    const raw = lines.join('\r\n');
    return Buffer.from(raw).toString('base64url');
};

// Send an email via Gmail API (HTTPS)
const sendMail = async ({ to, subject, html }) => {
    const raw = buildRawEmail({ to, subject, html });
    try {
        const result = await gmail.users.messages.send({
            userId: 'me',
            requestBody: { raw },
        });
        return result;
    } catch (err) {
        // Log the FULL error from Google API
        const gErr = err.response?.data?.error;
        if (gErr) {
            console.error(`❌ Gmail API error [${gErr.code}]: ${gErr.message}`);
            if (gErr.errors) console.error('   Details:', JSON.stringify(gErr.errors));
        } else {
            console.error(`❌ Gmail send error: ${err.message}`);
            if (err.stack) console.error(err.stack);
        }
        throw err;
    }
};

// Verify Gmail API configuration — call once on server start
const verifyEmailTransporter = async () => {
    if (!EMAIL_USER || !GMAIL_CLIENT_ID || !GMAIL_CLIENT_SECRET || !GMAIL_REFRESH_TOKEN) {
        console.warn('⚠️  Gmail API credentials incomplete — emails will NOT be sent');
        console.warn('   → EMAIL_USER:', EMAIL_USER ? '✓' : '✗');
        console.warn('   → GMAIL_CLIENT_ID:', GMAIL_CLIENT_ID ? `✓ (${GMAIL_CLIENT_ID.substring(0, 12)}...)` : '✗');
        console.warn('   → GMAIL_CLIENT_SECRET:', GMAIL_CLIENT_SECRET ? '✓' : '✗');
        console.warn('   → GMAIL_REFRESH_TOKEN:', GMAIL_REFRESH_TOKEN ? `✓ (${GMAIL_REFRESH_TOKEN.substring(0, 10)}...)` : '✗');
        return false;
    }
    try {
        // Force a token refresh to validate credentials
        const { token } = await oAuth2Client.getAccessToken();
        console.log(`✅ Gmail API ready — sending as ${EMAIL_USER} (HTTPS)`);
        console.log(`   → Access token obtained: ${token ? 'yes' : 'no'}`);
        return true;
    } catch (err) {
        console.error(`❌ Gmail API auth failed: ${err.message}`);
        if (err.response?.data) console.error('   → Google response:', JSON.stringify(err.response.data));
        console.error('   → Re-generate your refresh token at https://developers.google.com/oauthplayground');
        return false;
    }
};

// Generate random password
const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
        password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
};

// Send credentials email
const sendCredentialsEmail = async (user, password) => {
    const emailData = {
        to: user.email,
        subject: '🚀 Access Granted: Semiconductor Summit 2.0 Credentials',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f5; padding-bottom: 40px; }
        .webkit { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
        .header { background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); padding: 40px 0; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 16px; }
        .message { font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 32px; }
        
        .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 32px; }
        .card-header { font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        
        .field-group { margin-bottom: 16px; }
        .field-group:last-child { margin-bottom: 0; }
        .label { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 500; }
        .value { display: block; font-size: 18px; color: #0f172a; font-family: 'Courier New', Courier, monospace; font-weight: 600; background: #fff; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; }
        
        .events-title { font-size: 14px; font-weight: 600; color: #1f2937; margin-bottom: 12px; }
        .tag { display: inline-block; background-color: #eff6ff; color: #2563eb; font-size: 13px; font-weight: 500; padding: 4px 10px; border-radius: 9999px; margin-right: 6px; margin-bottom: 6px; border: 1px solid #bfdbfe; }
        
        .btn-container { text-align: center; margin-top: 32px; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 6px; transition: background-color 0.2s; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2); }
        .btn:hover { background-color: #1d4ed8; }
        
        .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
        .secure-note { display: flex; align-items: center; justify-content: center; margin-top: 24px; font-size: 13px; color: #d97706; background-color: #fffbeb; padding: 12px; border-radius: 6px; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="webkit">
            <div class="header">
                <div class="logo">⚡ SEMICONDUCTOR SUMMIT</div>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${user.name},</div>
                <div class="message">
                    Your registration has been successfully verified. We have generated a secure account for you to access the participant dashboard.
                </div>

                <div class="card">
                    <div class="card-header">Access Credentials</div>
                    
                    <div class="field-group">
                        <span class="label">USERNAME / EMAIL</span>
                        <span class="value">${user.email}</span>
                    </div>
                    
                    <div class="field-group">
                        <span class="label">TEMPORARY PASSWORD</span>
                        <span class="value">${password}</span>
                    </div>
                </div>

                <div class="events-title">YOUR REGISTERED EVENTS</div>
                <div style="margin-bottom: 24px;">
                    ${(() => {
                const ec = user.eventChoices || {};
                const tags = [];
                if (ec.panelDiscussion) tags.push('Inaugural Talk & Panel Discussion');
                if (ec.day1Workshop === 'rtl-gds') tags.push('RTL to GDS II Workshop');
                else if (ec.day1Workshop === 'fpga') tags.push('FPGA Interfacing Workshop');
                if (ec.expertInsights) tags.push('Expert Insights: VLSI vs Embedded');
                if (ec.sharkTank) tags.push('Silicon Shark Tank');
                if (ec.aiInVlsi) tags.push('Impact of AI in VLSI');
                if (ec.treasureHunt) tags.push('Silicon Jackpot (Treasure Hunt)');
                if (ec.silentGallery) tags.push('Silicon Silent Gallery');
                // Fallback to legacy selectedEvents
                if (tags.length === 0 && user.selectedEvents?.length > 0) {
                    return user.selectedEvents.map(e => `<span class="tag">${e}</span>`).join('');
                }
                return tags.length > 0
                    ? tags.map(t => `<span class="tag">${t}</span>`).join('')
                    : '<span class="tag">Standard Access — All General Sessions</span>';
            })()}
                </div>

                <div class="btn-container">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="btn">Access Dashboard</a>
                </div>

                <div class="secure-note">
                    🔒 Security Notice: Please change your password immediately after your first login.
                </div>
            </div>

            <div class="footer">
                <p>This email was sent to ${user.email}</p>
                <p>&copy; 2026 Semiconductor Summit 2.0. All rights reserved.</p>
                <p>Charusat University, Changa</p>
            </div>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        await sendMail(emailData);
        console.log(`✅ Credentials email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error(`❌ Credentials email failed: ${error.message}`);
        return false;
    }
};

// Send rejection email
const sendRejectionEmail = async (user, reason) => {
    const emailData = {
        to: user.email,
        subject: 'Action Required: Registration Status Update',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f5; padding-bottom: 40px; }
        .webkit { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background-color: #ef4444; padding: 30px 0; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: #ffffff; }
        .content { padding: 40px; }
        .title { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 16px; }
        .message { font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 24px; }
        .reason-box { background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-bottom: 24px; }
        .reason-title { font-weight: 600; color: #991b1b; font-size: 14px; margin-bottom: 4px; }
        .reason-text { color: #b91c1c; font-size: 15px; }
        .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="webkit">
            <div class="header">
                <div class="logo">⚠️ Verification Issue</div>
            </div>
            
            <div class="content">
                <div class="title">Hello ${user.name},</div>
                <div class="message">
                    We reviewed your registration but were unable to verify your payment details. As a result, your account could not be activated at this time.
                </div>

                <div class="reason-box">
                    <div class="reason-title">ISSUE DETAILS</div>
                    <div class="reason-text">${reason || 'Payment verification failed. Please ensure the transaction ID is correct.'}</div>
                </div>

                <div class="message">
                    Please try registering again with the correct payment information, or contact our support team if you believe this is an error.
                </div>
            </div>

            <div class="footer">
                <p>&copy; 2026 Semiconductor Summit 2.0</p>
            </div>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        await sendMail(emailData);
        console.log(`✅ Rejection email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error(`❌ Rejection email failed: ${error.message}`);
        return false;
    }
};

// Send password reset email
const sendPasswordResetEmail = async (user, newPassword) => {
    const emailData = {
        to: user.email,
        subject: '🔑 Security Notification: Password Reset',
        html: `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body { margin: 0; padding: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f5; }
        .wrapper { width: 100%; table-layout: fixed; background-color: #f4f4f5; padding-bottom: 40px; }
        .webkit { max-width: 600px; background-color: #ffffff; margin: 0 auto; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 30px 0; text-align: center; }
        .logo { font-size: 24px; font-weight: bold; color: #ffffff; letter-spacing: 1px; }
        .content { padding: 40px; }
        .greeting { font-size: 20px; font-weight: 600; color: #1f2937; margin-bottom: 16px; }
        .message { font-size: 16px; line-height: 24px; color: #4b5563; margin-bottom: 32px; }
        
        .card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 24px; margin-bottom: 32px; }
        .card-header { font-size: 14px; font-weight: 600; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px; border-bottom: 1px solid #e2e8f0; padding-bottom: 8px; }
        
        .field-group { margin-bottom: 16px; }
        .field-group:last-child { margin-bottom: 0; }
        .label { display: block; font-size: 12px; color: #64748b; margin-bottom: 4px; font-weight: 500; }
        .value { display: block; font-size: 18px; color: #0f172a; font-family: 'Courier New', Courier, monospace; font-weight: 600; background: #fff; padding: 8px 12px; border: 1px solid #cbd5e1; border-radius: 4px; }
        
        .btn-container { text-align: center; margin-top: 32px; }
        .btn { display: inline-block; background-color: #059669; color: #ffffff; font-size: 16px; font-weight: 600; text-decoration: none; padding: 14px 32px; border-radius: 6px; transition: background-color 0.2s; }
        .btn:hover { background-color: #047857; }
        
        .footer { background-color: #f8fafc; padding: 24px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="webkit">
            <div class="header">
                <div class="logo">🔒 PASSWORD RESET</div>
            </div>
            
            <div class="content">
                <div class="greeting">Hello ${user.name},</div>
                <div class="message">
                    As requested, your password has been securely reset. You can now login using these new credentials.
                </div>

                <div class="card">
                    <div class="card-header">New Credentials</div>
                    
                    <div class="field-group">
                        <span class="label">USERNAME</span>
                        <span class="value">${user.email}</span>
                    </div>
                    
                    <div class="field-group">
                        <span class="label">NEW PASSWORD</span>
                        <span class="value">${newPassword}</span>
                    </div>
                </div>

                <div class="btn-container">
                    <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/login" class="btn">Login Now</a>
                </div>
            </div>

            <div class="footer">
                <p>If you did not request this change, please contact support immediately.</p>
                <p>&copy; 2026 Semiconductor Summit 2.0</p>
            </div>
        </div>
    </div>
</body>
</html>
        `
    };

    try {
        await sendMail(emailData);
        console.log(`✅ Password reset email sent to ${user.email}`);
        return true;
    } catch (error) {
        console.error(`❌ Password reset email failed: ${error.message}`);
        return false;
    }
};

module.exports = {
    generatePassword,
    sendCredentialsEmail,
    sendRejectionEmail,
    sendPasswordResetEmail,
    verifyEmailTransporter
};
