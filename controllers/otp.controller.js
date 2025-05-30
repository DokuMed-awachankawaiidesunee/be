const { sendOtp, verifyOtp } = require('../utils/twilio');

exports.sendOtpWhatsApp = async (req, res) => {
  const { phone } = req.body;
  try {
    await sendOtp(phone);
    res.json({ message: 'OTP sent via WhatsApp' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyOtpWhatsApp = async (req, res) => {
  const { phone, code } = req.body;
  try {
    const verification = await verifyOtp(phone, code);
    if (verification.status === 'approved') {
      res.json({ message: 'OTP verified successfully' });
    } else {
      res.status(400).json({ message: 'Invalid or expired OTP' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
