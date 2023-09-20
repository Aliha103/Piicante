const Sauce = require("../models/sauce");

exports.likeDislikeSauce = async (req, res) => {
  try {
    const sauce = await Sauce.findOne({ _id: req.params.id });

    if (!sauce) {
      return res.status(404).json({ message: "Sauce not found" });
    }

    const userId = req.body.userId;
    const like = req.body.like;

    switch (like) {
      case 1:
        if (!sauce.usersLiked.includes(userId) && like === 1) {
          await Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: 1 },
              $push: { usersLiked: userId },
            }
          );
          return res.status(201).json({ message: "Like set to 1" });
        }
        break;

      case -1:
        if (!sauce.usersDisliked.includes(userId) && like === -1) {
          await Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: 1 },
              $push: { usersDisliked: userId },
            }
          );
          return res.status(201).json({ message: "Dislike set to -1" });
        }
        break;

      case 0:
        if (sauce.usersLiked.includes(userId)) {
          await Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { likes: -1 },
              $pull: { usersLiked: userId },
            }
          );
          return res.status(201).json({ message: "Like set to 0" });
        }

        if (sauce.usersDisliked.includes(userId)) {
          await Sauce.updateOne(
            { _id: req.params.id },
            {
              $inc: { dislikes: -1 },
              $pull: { usersDisliked: userId },
            }
          );
          return res.status(201).json({ message: "Dislike set to 0" });
        }
        break;

      default:
        return res.status(400).json({ message: "Invalid like value" });
    }
  } catch (error) {
    return res.status(500).json({ error });
  }
};
