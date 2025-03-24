require('dotenv').config(); // Load environment variables

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');

// Importing routes
const college = require('./router/college');
const student = require('./router/student');
const login = require('./router/login');
const categories = require('./router/category');
const states = require('./router/state');
const services = require('./router/service');
const city = require('./router/city');

// Load config values from environment variables
const { API_VERSION, DB_STRING, NODE_ENV, PORT } = process.env;

// Debugging log to check if .env is loaded correctly
console.log("📌 API_VERSION:", API_VERSION);
console.log("📌 DB_STRING:", DB_STRING ? "Loaded Successfully ✅" : "❌ Not Loaded");
console.log("📌 NODE_ENV:", NODE_ENV);
console.log("📌 PORT:", PORT);

const app = express();
app.use(express.json());

// CORS configuration
const corsOptions = { exposedHeaders: 'auth' };
app.use(cors(corsOptions));

// Define API routes
app.use(`${API_VERSION}/categoryImages/:id`, (req, res) => {
  res.sendFile(path.join(__dirname, `categoryImages/${req.params.id}.png`));
});
app.use(`${API_VERSION}/college`, college);
app.use(`${API_VERSION}/student`, student);
app.use(`${API_VERSION}/login`, login);
app.use(`${API_VERSION}/categories`, categories);
app.use(`${API_VERSION}/states`, states);
app.use(`${API_VERSION}/services`, services);
app.use(`${API_VERSION}/city`, city);

// Middleware for logging in development mode
if (NODE_ENV === 'development') {
  app.use(morgan('tiny'));
}

// Serve frontend files in production mode
if (NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
  );
}

// Database connection
(async () => {
  try {
    if (!DB_STRING) {
      throw new Error("❌ DB_STRING is not defined. Check your .env file.");
    }

    await mongoose.connect(DB_STRING, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("✅ MongoDB Connected Successfully!");
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
  }
})();

// Start server
app.listen(5000, () => {
  console.log(`🚀 Server is running on PORT 5000`);
});
