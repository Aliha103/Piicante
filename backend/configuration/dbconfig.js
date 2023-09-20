require("dotenv").config();
module.exports = {
  url: process.env.MONGODB_URI, // Using the environment variable for the URI
  options: {
    useNewUrlParser: true, // Use new URL parser
    useUnifiedTopology: true, // Use new Server Discover and Monitoring engine
  },
};
