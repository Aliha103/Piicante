const Sauce = require("../models/sauce");
const fs = require("fs"); // Import the fs module for file operations

exports.createSauce = (req, res, next) => {
  try {
    // Parse requestData and create a newSauce object
    const requestData = JSON.parse(req.body.sauce); // Parse the JSON data in req.body.sauce
    const url = req.protocol + "://" + req.get("host");
    const newSauce = new Sauce({
      userId: requestData.userId,
      name: requestData.name,
      manufacturer: requestData.manufacturer,
      description: requestData.description,
      mainPepper: requestData.mainPepper,
      imageUrl: url + "/images/" + req.file.filename,
      heat: requestData.heat,
    });

    console.log("Sauce is fetched", newSauce);

    newSauce
      .save()
      .then(() => {
        res.status(201).json({
          message: "Sauce saved successfully!",
        });
      })
      .catch((error) => {
        console.error("Create Sauce Error:", error); // Log the error here
        res.status(500).json({
          error: "An error occurred while saving the sauce.", // Send a generic error message
        });
      });
  } catch (error) {
    console.error("JSON parsing error:", error);
    res.status(400).json({ error: "Invalid JSON data in req.body.sauce" });
  }
};

exports.getOneSauce = (req, res, next) => {
  try {
    Sauce.findOne({
      _id: req.params.id,
    })
      .then((sauce) => {
        if (!sauce) {
          res.status(404).json({
            message: "Sauce not found.",
          });
        } else {
          res.status(200).json(sauce);
        }
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  } catch (error) {
    console.error("Error in getOneSauce:", error);
    res.status(500).json({
      error: "An error occurred while processing the request.",
    });
  }
};

exports.modifySauce = (req, res, next) => {
  const url = req.protocol + "://" + req.get("host");

  // Construct the imageUrl based on whether a file is provided
  let imageUrl = req.body.imageUrl; // Use the existing imageUrl by default
  if (req.file) {
    imageUrl = url + "/images/" + req.file.filename;
  }

  const updatedSauce = {
    name: req.body.name,
    manufacturer: req.body.manufacturer,
    description: req.body.description,
    mainPepper: req.body.mainPepper,
    imageUrl: imageUrl,
    heat: req.body.heat,
  };

  try {
    Sauce.updateOne({ _id: req.params.id }, updatedSauce)
      .then(() => {
        res.status(200).json({
          message: "Sauce updated successfully!",
        });
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  } catch (error) {
    console.error("Error in modifySauce:", error);
    res.status(500).json({
      error: "An error occurred while processing the request.",
    });
  }
};

exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        return res.status(404).json({
          message: "Sauce not found.",
        });
      }

      // Extract the filename from the imageUrl
      const filename = sauce.imageUrl.split("/images/")[1];

      // Delete the associated image file
      fs.unlink("images/" + filename, (unlinkError) => {
        if (unlinkError) {
          console.error("Error deleting image:", unlinkError);
        }

        // Delete the Sauce object from the database
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => {
            res.status(200).json({
              message: "Sauce deleted successfully!",
            });
          })
          .catch((deleteError) => {
            console.error("Error deleting Sauce:", deleteError);
            res.status(500).json({
              error: "An error occurred while deleting the Sauce.",
            });
          });
      });
    })
    .catch((error) => {
      console.error("Error finding Sauce:", error);
      res.status(500).json({
        error: "An error occurred while processing the request.",
      });
    });
};

exports.getAllSauces = (req, res, next) => {
  try {
    Sauce.find()
      .then((sauces) => {
        res.status(200).json(sauces);
      })
      .catch((error) => {
        res.status(500).json({
          error: error,
        });
      });
  } catch (error) {
    console.error("Error in getAllSauces:", error);
    res.status(500).json({
      error: "An error occurred while processing the request.",
    });
  }
};
