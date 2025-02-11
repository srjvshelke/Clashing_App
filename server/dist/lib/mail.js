import nodemailer from "nodemailer";
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});
// async..await is not allowed in global scope, must use a wrapper
export const sendMail = async (to, subject, body) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.FROM_EMAIL,
            to: to,
            subject: subject,
            html: body,
        });
        console.log("Message sent: %s", info.messageId);
        console.log("SMTP Response: ", info);
    }
    catch (error) {
        console.error("Error sending email: ", error);
    }
};
// main().catch(console.error);
