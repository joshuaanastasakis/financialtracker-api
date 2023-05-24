const nodemailer = require('nodemailer');


export function mail (email:string, message:string)  {
    console.log("Sending email")
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    var mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'EMAIL CONFIRMATION',
        text: `Financial Tracker Confirmation PIN is:\n\n${message}`
    };

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) console.log(error);
        else console.log(`Email sent: ${info.response}`)
    });

}