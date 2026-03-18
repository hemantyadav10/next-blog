import { Resend } from 'resend';
import { EMAIL_FROM } from '../constants';

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailOptions = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  return resend.emails.send({
    to,
    from: EMAIL_FROM,
    subject,
    html,
  });
}
