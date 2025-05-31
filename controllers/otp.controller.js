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
    
    otpStore[phoneNumber] = otpCode;

    console.log('[SEND] otpStore:', otpStore);

    res.json({ message: 'OTP sent via WhatsApp' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};



const verifyOtpWhatsApp = async (req, res) => {
  let { phoneNumber, code } = req.body;

  if (!phoneNumber || !code) {
    return res.status(400).json({ message: 'phoneNumber and code are required' });
  }

  // Normalisasi: pastikan + di depan
  phoneNumber = phoneNumber.trim();
  if (!phoneNumber.startsWith('+')) {
    phoneNumber = '+' + phoneNumber;
  }

  const storedOtp = otpStore[phoneNumber];
  if (!storedOtp) return res.status(400).json({ message: 'OTP not found or expired' });
  if (storedOtp !== code.toString().trim()) return res.status(400).json({ message: 'Invalid OTP code' });

  delete otpStore[phoneNumber];
  res.json({ message: 'OTP verified successfully' });
};


module.exports = {
  sendOtpHandler,
  verifyOtpWhatsApp,
};
