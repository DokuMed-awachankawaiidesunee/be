const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

function sendOtp(phoneNumber) {
  console.log('Service SID in use:', process.env.TWILIO_VERIFY_SERVICE_SID);

  return client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verifications
    .create({
      to: `whatsapp:${phoneNumber}`,
      channel: 'whatsapp'
    });
}

function verifyOtp(phoneNumber, code) {
  return client.verify.v2.services(process.env.TWILIO_VERIFY_SERVICE_SID)
    .verificationChecks
    .create({
      to: `whatsapp:${phoneNumber}`,
      code
    });
}

module.exports = { sendOtp, verifyOtp };


