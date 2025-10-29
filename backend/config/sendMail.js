const nodemailer = require('nodemailer')

const sendMail = async ({email, subject, html})=>{
    // Setup SMTP
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD
        }
    })

    // Send Email
    await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: subject,
        // text: '',
        html: html
    })
}


module.exports = sendMail