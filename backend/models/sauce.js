/* const uniqueValidator = require("mongoose-unique-validator"); */
const mongoose = require("mongoose");
const sauceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  name: { type: String, required: true },
  manufacturer: { type: String, required: true },
  description: { type: String, required: true },
  mainPepper: { type: String, required: true },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  // Likes and dislikes
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  usersLiked: { type: [String], default: [] },
  usersDisliked: { type: [String], default: [] },
});

// sauceSchema.plugin(uniqueValidator);
// Export the sauce model;
module.exports = mongoose.model("Sauce", sauceSchema);
