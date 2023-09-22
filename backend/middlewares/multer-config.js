const multer = require("multer");

const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_").split(".")[0];

    try {
      if (typeof MIME_TYPES[file.mimetype] !== "undefined") {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + "." + extension);
      } else {
        const error = new Error("Invalid file type");
        error.message =
          "This type of photo is not allowed. Please attach a JPG or PNG.";
        callback(error, null);
      }
    } catch (error) {
      callback(error, null);
    }
  },
});

module.exports = (req, res, next) => {
  const upload = multer({
    storage: storage,
  }).single("image");

  upload(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      // A Multer error occurred (e.g., file size limit exceeded)
      res.status(400).json({ message: "Multer error: " + err.message });
    } else if (err) {
      // An error occurred during file upload (e.g., invalid file type)
      res.status(400).json({ message: err.message });
    } else {
      // File upload successful
      next();
    }
  });
};
