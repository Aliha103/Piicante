const Sauce = require("../models/sauce.model");

exports.createSauce = (req, res, next) => {
  req.body.sauce = JSON.parse(req.body.sauce);
  const url = req.protocol + "://" + req.get("host");

  // Construct the imageUrl using the provided code
  const imageUrl = url + "/images/" + req.file.filename;

  const sauce = new Sauce({
    userId: req.body.userId,
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: imageUrl, // Use the constructed imageUrl
    heat: req.body.heat,
  });

  sauce
    .save()
    .then(() => {
      res.status(201).json({
        message: "Sauce saved successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Failed to save sauce.",
        error: error.message, // Include the error message
      });
    });
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({
    _id: req.params.id,
  })
    .then((sauce) => {
      res.status(200).json(sauce);
    })
    .catch((error) => {
      res.status(404).json({
        error: error,
      });
    });
};
exports.modifySauce = (req, res, next) => {
  let sauce = new Sauce({ _id: req.params._id });
  if (req.file) {
    const url = req.protocol + "://" + req.get("host");
    req.body.sauce = JSON.parse(req.body.sauce);
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: url + "/images/" + req.file.filename,
      heat: req.body.heat,
      userId: req.body.thing.userId,
    };
  } else {
    sauce = {
      _id: req.params.id,
      name: req.body.name,
      manufacturer: req.body.manufacturer,
      description: req.body.description,
      mainPepper: req.body.mainPepper,
      imageUrl: url + "/images/" + req.file.filename,
      heat: req.body.heat,
      userId: req.body.userId,
    };
  }
  Sauce.updateOne({ _id: req.params.id }, thing)
    .then(() => {
      res.status(201).json({
        message: "Sauce updated successfully!",
      });
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
exports.deleteObjectWithImage = (req, res, next, Model) => {
  Model.findOne({ _id: req.params.id }).then((object) => {
    if (!object) {
      return res.status(404).json({
        error: new Error("Objet non trouvé !"),
      });
    }
    if (object.userId !== req.auth.userId) {
      return res.status(401).json({
        error: new Error("Requête non autorisée !"),
      });
    }

    // Assuming your objects have an "imageUrl" property
    const filename = object.imageUrl.split("/images/")[1];
    fs.unlink("images/" + filename, () => {
      Model.deleteOne({ _id: req.params.id })
        .then(() => {
          res.status(200).json({
            message: "Deleted!",
          });
        })
        .catch((error) => {
          res.status(400).json({
            error: error,
          });
        });
    });
  });
};

// Use the function for deleting sauces
exports.deleteSauce = (req, res, next) => {
  exports.deleteObjectWithImage(req, res, next, Sauce);
};

// Use the function for deleting things
exports.deleteThing = (req, res, next) => {
  exports.deleteObjectWithImage(req, res, next, Thing);
};

exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauces) => {
      res.status(200).json(sauces);
    })
    .catch((error) => {
      res.status(400).json({
        error: error,
      });
    });
};
