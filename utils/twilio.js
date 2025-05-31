const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendOtp(phoneNumber, otpCode) {
  return client.messages.create({
    body: `Your DokuMed OTP is: ${otpCode}`,
    from: 'whatsapp:+14155238886', 
    to: `whatsapp:${phoneNumber}`
  });
}

module.exports = { sendOtp };
