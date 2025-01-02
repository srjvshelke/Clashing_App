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
export const sendmail = async (to, subject, body) => {
    // send mail with defined transport object
    const info = await transporter.sendMail({
        from: process.env.FROM_EMAIL, // sender address
        to: to, // list of receivers
        subject: subject, // Subject line 
        html: body, // html body
    });
    console.log("Message sent: %s", info.messageId);
    // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
};
// main().catch(console.error);
