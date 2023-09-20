const mongoose = require("mongoose");
const dbConfig = require("./configuration/dbConfig"); // Import your dbConfig.js

mongoose
  .connect(dbConfig.url, dbConfig.options) // Use the exported URL and options
  .then(() => {
    console.log("Successfully connected to MongoDB Atlas!");
  })
  .catch((error) => {
    console.log("Unable to connect to MongoDB Atlas!");
    console.error(error);
  });
