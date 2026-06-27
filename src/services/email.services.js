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


async function sendTransactionEmail(userEmail, name, transactionDetails) {
    const to = userEmail;
    const subject = "Transaction Notification from Test_Backend";
    const text = `Hello ${name},\n\nYour recent transaction was processed:\n${transactionDetails}\n\nThank you for using Test_Backend.`;
    const html = `<p>Hello <b>${name}</b>,</p>
                  <p>Your recent transaction was processed:</p>
                  <pre>${transactionDetails}</pre>
                  <p>Thank you for using <b>Test_Backend</b>.</p>`;

    await sendEmail(to, subject, text, html);
}

// Email notification for receiver of transaction
async function sendTransactionReceiverEmail(receiverEmail, receiverName, transactionDetails) {
    const to = receiverEmail;
    const subject = "You Have Received a Transaction - Test_Backend";
    const text = `Hello ${receiverName},\n\nYou have received a new transaction:\n${transactionDetails}\n\nThank you for using Test_Backend.`;
    const html = `<p>Hello <b>${receiverName}</b>,</p>
                  <p>You have received a new transaction:</p>
                  <pre>${transactionDetails}</pre>
                  <p>Thank you for using <b>Test_Backend</b>.</p>`;

    await sendEmail(to, subject, text, html);
}




async function sendFailedTransactionEmail(userEmail, name, transactionDetails, failureReason) {
    const to = userEmail;
    const subject = "Transaction Failed - Test_Backend";
    const text = `Hello ${name},\n\nUnfortunately, your recent transaction could not be processed.\nDetails: ${transactionDetails}\nReason: ${failureReason}\n\nPlease try again or contact support if you need assistance.\n\nThank you for using Test_Backend.`;
    const html = `<p>Hello <b>${name}</b>,</p>
                  <p><b>Unfortunately, your recent transaction could not be processed.</b></p>
                  <p>Details:</p>
                  <pre>${transactionDetails}</pre>
                  <p>Reason: <b>${failureReason}</b></p>
                  <p>Please try again or contact support if you need assistance.</p>
                  <p>Thank you for using <b>Test_Backend</b>.</p>`;

    await sendEmail(to, subject, text, html);
}



// Fix: Export only the sendEmail function as default, matching expected usage in app.js
module.exports = {sendRegistrationEmail ,sendTransactionEmail ,sendFailedTransactionEmail,sendTransactionReceiverEmail};
