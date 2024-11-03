require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const petRouter = require('./Routes/PetRoute');
const AdoptFormRoute = require('./Routes/AdoptFormRoute');
const AdminRoute = require('./Routes/AdminRoute');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS configuration
app.use(
  cors({
    origin: ['http://localhost:3000', 'https://petshopbd.netlify.app'], // Add additional origins as needed
    methods: ['GET', 'POST', 'OPTIONS', 'PATCH', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

// Static file serving for images
app.use('/images', express.static(path.join(__dirname, 'images')));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add a root route to confirm the server is running
app.get('/', (req, res) => {
  res.send('Server is running okay!');
});

// Use your routers
app.use(petRouter);
app.use('/form', AdoptFormRoute);
app.use('/admin', AdminRoute);

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.mongooseURL)
  .then(() => {
    console.log('Connected to DB');
    const PORT = process.env.PORT || 4000; // Use environment variable for port
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error(err);
  });
