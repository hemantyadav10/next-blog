import { APP_NAME } from '../constants';
import { sendEmail } from './sendEmail';

export async function sendPasswordResetEmail({
  resetLink,
  userEmail,
  username,
}: {
  resetLink: string;
  username: string;
  userEmail: string;
}) {
  return sendEmail({
    to: userEmail,
    subject: 'Reset your password',
    html: `
      <!DOCTYPE html>
      <html lang="en">

      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Reset Password</title>
      </head>

      <body
        style="margin:0;padding:24px;background:#ffffff;color:#111111;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;text-align:center;">

        <table width="100%" cellpadding="0" cellspacing="0" role="presentation" align="center">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0" role="presentation" style="max-width:520px;text-align:center;" align="center">

                <!-- Title -->
                <tr>
                  <td style="font-size:18px;font-weight:600;padding-bottom:16px;">
                    Reset your password
                  </td>
                </tr>

                <!-- Greeting -->
                <tr>
                  <td style="font-size:14px;line-height:1.6;padding-bottom:16px;">
                    Hi ${username},
                  </td>
                </tr>

                <!-- Message -->
                <tr>
                  <td style="font-size:14px;line-height:1.6;padding-bottom:20px;">
                    We received a request to reset the password for your account on <strong>${APP_NAME}</strong>.
                    Click the button below to set a new one. This link expires in 15 minutes.
                  </td>
                </tr>

                <!-- Button -->
                <tr>
                  <td style="padding-bottom:20px;" align="center">
                    <a href="${resetLink}"
                      style="display:inline-block;padding:10px 16px;font-size:14px;font-weight:500;color:#ffffff;background:#005cbb;text-decoration:none;">
                      Reset password
                    </a>
                  </td>
                </tr>

                <!-- Fallback -->
                <tr>
                  <td style="font-size:12px;line-height:1.5;color:#555555;padding-bottom:16px;">
                    If the button doesn't work, copy and paste this URL into your browser:<br /><br />
                    <a href="${resetLink}" style="color:#005cbb;text-decoration:none; word-break:break-all;">
                      ${resetLink}
                    </a>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="font-size:12px;line-height:1.5;color:#555555;padding-bottom:16px;">
                    If you did not request this, please ignore this email. Your password will remain unchanged.
                  </td>
                </tr>

                <!-- Meta -->
                <tr>
                  <td style="font-size:11px;line-height:1.5;color:#555555;border-top:1px solid #e5e5e5;padding-top:12px;">
                    © ${new Date().getFullYear()} ${APP_NAME}<br />
                    Sent to ${userEmail}
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>

      </html>
  `,
  });
}
