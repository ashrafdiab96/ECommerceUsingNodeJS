/**
 * @file sendEmail.js
 * @desc handle send emails
 * @version 1.0.0
 * @author AshrafDiab
 */

// package for sending emails
const nodemailer = require('nodemailer');

/**
 * @method sendEmail
 * @desc handle sending emails
 * @param {*} options 
 * @returns {void} void
 */
const sendEmail = async (options) => {
    // create transporter, service will send email (gmail, mailgun ...)
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // define email options (from, to, subject, content)
    const mailOptions = {
        from: `${process.env.APP_NAME} <<${process.env.EMAIL_USER}>>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
    }
    // send email
    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;