const express = require("express"); // Importing express to create the API router
const router = express.Router(); // Creating an instance of the router

// Defining a GET route at the root of the /api/v1/demo path
router.get("/", (req, res) => {
  // Respond with a JSON message indicating the API is working
  res.status(200).json({ message: "API is working" });
});

// Exporting the router so it can be used in other files
module.exports = router;
