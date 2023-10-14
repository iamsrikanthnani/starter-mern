const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie"); // Import the Movie model

// Get a list of all movies
router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new movie
router.post("/", async (req, res) => {
  const { title, description, releaseDate } = req.body;

  if (!title || !description) {
    return res
      .status(400)
      .json({ error: "Please provide all required fields." });
  }

  const newMovie = new Movie({
    title,
    description,
    releaseDate,
  });

  try {
    const savedMovie = await newMovie.save();
    res.json(savedMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get details of a movie by ID
router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ error: "Movie not found." });
    }
    res.json(movie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a movie by ID
router.put("/:id", async (req, res) => {
  const { title, description, releaseDate } = req.body;

  try {
    const updatedMovie = await Movie.findByIdAndUpdate(req.params.id, {
      title,
      description,
      releaseDate,
    });
    res.json(updatedMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a movie by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedMovie = await Movie.findByIdAndRemove(req.params.id);
    res.json(deletedMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
