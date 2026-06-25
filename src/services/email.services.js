require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

// Optional: Verify the connection configuration once, for debugging.
// Remove or comment out in production to avoid unnecessary logs.
transporter.verify((error, success) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }

  if(success){
    console.log('connection sucess');
    
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Test_Backend" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    // The following line is only useful for test accounts like Ethereal, not for Gmail
    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};


async function sendRegistrationEmail(userEmail,name) {
    const to=userEmail
    const subject = "Welcome to Test_Backend!";
    const text = `Hello ${name},\n\nThank you for registering at Test_Backend. We're excited to have you on board!`;
    const html = `<p>Hello <b>${name}</b>,</p><p>Thank you for registering at <b>Test_Backend</b>. We're excited to have you on board!</p>`;

await sendEmail(to,subject,text,html)
}

// Fix: Export only the sendEmail function as default, matching expected usage in app.js
module.exports = {sendRegistrationEmail};
