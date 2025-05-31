const { sendOtp } = require('../utils/twilio');

const otpStore = {};

const sendOtpHandler = async (req, res) => {
  const { phoneNumber } = req.body;
  console.log("Received phone number:", phoneNumber);

  if (!phoneNumber) {
    return res.status(400).json({ error: 'phoneNumber is required' });
  }

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await sendOtp(phoneNumber, otpCode);
    res.json({ message: 'OTP sent via WhatsApp' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};



const verifyOtpWhatsApp = async (req, res) => {
  const { phoneNumber, code } = req.body;
  try {
    const storedOtp = otpStore[phoneNumber];
    if (!storedOtp) return res.status(400).json({ message: 'OTP not found or expired' });
    if (storedOtp !== code) return res.status(400).json({ message: 'Invalid OTP code' });

    delete otpStore[phoneNumber];
    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Verification failed' });
  }
};

module.exports = {
  sendOtpHandler,
  verifyOtpWhatsApp,
};
