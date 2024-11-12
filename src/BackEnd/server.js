// Importing required modules
const express = require('express'); // Express framework for creating the server
const cors = require('cors'); // CORS (Cross-Origin Resource Sharing) for handling cross-origin requests
const bodyParser = require('body-parser'); // Middleware to parse request bodies, especially JSON
const mongoose = require('mongoose'); // Mongoose for MongoDB connection and schema management

const app = express(); // Creating an instance of the Express app
const port = 4000; // Defining the port the server will listen on

// Middleware
app.use(cors()); // Enable CORS to allow requests from different origins
app.use(bodyParser.json()); // Use bodyParser to parse JSON data in the request body

// MongoDB connection
const dbURI = 'mongodb+srv://admin:admin@moviedatacluster.o2fo7.mongodb.net/?retryWrites=true&w=majority&appName=MovieDataCluster'; // Replace with your actual MongoDB connection string
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true }) // Connect to MongoDB
  .then(() => console.log('Connected to MongoDB')) // Log success message on successful connection
  .catch(err => console.error('MongoDB connection error:', err)); // Log any connection errors

// Define a Mongoose schema for a movie
const movieSchema = new mongoose.Schema({
  title: String, //all lowercase to match create.js
  year: String,
  poster: String
});

// Create a Mongoose model from the schema
const Movie = mongoose.model('Movie', movieSchema);

// GET endpoint to retrieve a movie by its ID
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.json(movies); // Returns an array of movies
  } catch (error) {
    // Handle invalid IDs or other errors
    console.error('Error retrieving movie:', error);
    res.status(500).json({ message: 'Failed to retrieve movie', error: error.message });
  }
});

// POST endpoint to add a new movie
app.post('/api/movies', async (req, res) => {
  try {
    const { title, year, poster } = req.body; // Extract data from request body

    // Create a new Movie instance
    const newMovie = new Movie({ title, year, poster });

    // Save the new movie to the database
    await newMovie.save();

    // Respond with success message and the saved movie data
    res.status(201).json({ message: 'Movie created successfully', movie: newMovie });
  } catch (error) {
    // Handle errors (e.g., validation errors, database issues)
    console.error('Error adding movie:', error);
    res.status(500).json({ message: 'Failed to create movie', error: error.message });
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`); // Log a message when the server is started
});
