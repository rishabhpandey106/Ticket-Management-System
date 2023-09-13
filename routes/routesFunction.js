const nodemailer = require('nodemailer');

function sendEmail(to, password) {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        logger: true,
        debug: true,
        secureConnection: false,
        auth: {
            user: 'youremail@gmail.com',
            pass: '******',
        },
        tls: {
            rejectUnauthorized: true
        }
    });

    const mailOptions = {
        from: 'youremail@gmail.com',
        to,
        subject: 'Employee Registration',
        text: `Your registration was successful. Your login credentials are:\nEmail: ${to}\nPassword: ${password}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}

module.exports = {
    sendEmail
};
