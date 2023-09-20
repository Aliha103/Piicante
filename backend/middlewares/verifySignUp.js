const User = require("../models/user");

checkDuplicateEmail = async (req, res, next) => {
  try {
    const { email } = req.body;

    // Check if the email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifySignUp = {
  checkDuplicateEmail,
};

module.exports = verifySignUp;
