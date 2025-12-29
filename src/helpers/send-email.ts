import nodemailer, { Transporter } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport/index.js';

interface EmailOptions {
    to: string;
    subject: string;
    text: string;
}

async function sendEmail(options: EmailOptions): Promise<void> {
    const config: SMTPTransport.Options = {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    };

    const transporter: Transporter = nodemailer.createTransport(config);

    try {
        await transporter.sendMail({
            from: String(process.env.SMTP_USER),
            to: options.to,
            subject: options.subject,
            text: options.text,
            // html: "<b>This is a test email.</b>",
            // attachments: [{
            //     filename: 'test.txt',
            //     content: 'Hello, this is a test attachment!'
            // }],
        });
    } catch (error) {
        return Promise.reject(error);
    }
}

export default sendEmail;