// Importing required modules
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import morgan from "morgan";

import router from "./routes/index.js"; // Importing the router that defines the API routes

const app = express(); // Creating an instance of the Express app

// Middlewares setup
app.use(morgan("dev")); // Logging HTTP requests in 'dev' format
app.use(express.json()); // Parsing JSON payloads in the request body
app.use(express.urlencoded({ extended: true })); // Parsing URL-encoded data in the request body
app.use(cookieParser()); // Parsing cookies from the request headers
app.use(cors()); // Enabling CORS for the application

// Use the imported router for handling routes
app.use(router);

// Fallback route for undefined routes (404 Not Found)
app.use(/(.*)/, (req, res) => {
  res.status(404).json({ message: "Route not found" }); // Respond with 404 and a message
});

// Export the app instance for use in other files
export default app;
