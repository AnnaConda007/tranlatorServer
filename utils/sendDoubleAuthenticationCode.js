const dotenv = require('dotenv').config();
const nodemailer = require('nodemailer');

const sendDoubleAuthenticationCode = async ({ res, recipientMail, textWithCode }) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.yandex.ru',
    port: 465,
    secure: true,
    auth: {
      user: process.env.YANDEX_SENDER_MAIL,
      pass: process.env.YANDEX_SENDER_PASSWORD
    }
  });
  const mailOptions = {
    from: process.env.YANDEX_SENDER_MAIL,
    to: recipientMail,
    subject: "Код для подтвержения почты при регистрации",
    text: textWithCode
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: error.response });
    } else {
      res.json({ sended: true });
    }
  });
}

module.exports = { sendDoubleAuthenticationCode };
