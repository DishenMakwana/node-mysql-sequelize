require('dotenv').config();
const nodemailer = require('nodemailer');

const sendMail = async (email, subject, body) => {
  let transporter;
  if (process.env.NODE_ENV === 'production') {
    const aws = require('aws-sdk');
    const ses = new aws.SES();

    transporter = nodemailer.createTransport({
      SES: ses,
    });
  } else if (process.env.NODE_ENV === 'development') {
    transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      // secure: false, // upgrade later with STARTTLS
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  const from = `"${process.env.MAIL_FROM_NAME}" <${process.env.MAIL_FROM_ADDRESS}>`;

  let mailOptions = {
    from: from,
    to: email,
    subject: subject,
    html: body,
  };

  try {
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error('error sending email : ', error);
      } else {
        console.info('Email sent: ' + info.response);
      }
    });
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = { sendMail };
