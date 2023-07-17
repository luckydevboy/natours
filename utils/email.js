const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: options.to, // list of receivers
    subject: options.subject, // Subject line
    // text: options.text, // plain text body
    html: options.text, // html body
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
