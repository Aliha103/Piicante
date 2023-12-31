const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Import the jsonwebtoken library
const User = require("../models/user.model");
const saltRounds = 10; // Number of salt rounds

exports.signup = (req, res) => {
 
  console.log(req.body);
  const { email, password } = req.body;
  console.log(email);
  console.log(password);

  if (!email || !password) {
    return res.status(400).json({
      error: "Email and password are required fields.",
    });
  }

  bcrypt
    .hash(password, saltRounds)
    .then((hash) => {
      const user = new User({
        email: email,
        password: hash,
      });
      user
        .save()
        .then(() => {
          res.status(201).json({
            message: "User added successfully!",
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};

exports.login = (req, res, next) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({
          error: "User not found!", // Removed the unnecessary 'new Error()'
        });
      }
      bcrypt
        .compare(req.body.password, user.password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({
              error: "Incorrect password!", // Removed the unnecessary 'new Error()'
            });
          }
          const token = jwt.sign({ userId: user._id }, "RANDOM_TOKEN_SECRET", {
            expiresIn: "24h",
          });
          res.status(200).json({
            userId: user._id,
            token: token,
          });
        })
        .catch((error) => {
          res.status(500).json({
            error: error,
          });
        });
    })
    .catch((error) => {
      res.status(500).json({
        error: error,
      });
    });
};
