import React, { useState, useEffect } from "react";
import "./App.css";

const MovieApp = () => {
  const [movies, setMovies] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    releaseDate: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // fetching movies
  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:3030/api/movies");
      if (response.ok) {
        const data = await response.json();
        setMovies(data);
      } else {
        console.error("Failed to fetch movies");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  // add or update a movie
  const addOrUpdateMovie = async () => {
    setErrorMessage("");
    if (formData?.title && formData?.description) {
      try {
        const response = await fetch(
          isEditing
            ? `http://localhost:3030/api/movies/${formData?.id}`
            : "http://localhost:3030/api/movies",
          {
            method: isEditing ? "PUT" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          const newMovie = await response.json();
          // clearing the movies state
          setFormData({ title: "", description: "", releaseDate: "" });
          // checking the isEditing status
          if (isEditing) {
            setIsEditing(false);
            fetchMovies();
          } else {
            setMovies([...movies, newMovie]);
          }
        } else {
          console.error("Failed to add a movie");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      if (!formData?.title) {
        setErrorMessage("movie title is required");
      } else if (!formData?.description) {
        setErrorMessage("movie description is required");
      }
    }
  };

  // delete movie
  const deleteMovie = async (id) => {
    try {
      const response = await fetch(`http://localhost:3030/api/movies/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setMovies(movies.filter((movie) => movie._id !== id));
      } else {
        console.error("Failed to delete the movie");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // edit movie on press
  const editMovie = (movie) => {
    // Set the form data to the movie's details for editing
    setFormData({
      title: movie.title,
      description: movie.description,
      releaseDate: movie.releaseDate,
      id: movie._id,
    });
    setIsEditing(true); // Set editing mode to true
  };

  return (
    <div className="movie-app">
      <h1 className="app-title">Movie App</h1>
      {/* form */}
      <form className="movie-form">
        {/* title */}
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        {/* description */}
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
        />
        {/* releaseDate */}
        <input
          type="date"
          name="releaseDate"
          placeholder="Release Date"
          value={formData.releaseDate}
          onChange={(e) =>
            setFormData({ ...formData, releaseDate: e.target.value })
          }
        />
        {errorMessage ? <p className="error-message">{errorMessage}</p> : null}
        {/* button */}
        <button type="button" className="add-button" onClick={addOrUpdateMovie}>
          {isEditing ? "Update Movie" : "Add Movie"}
        </button>
      </form>

      {/* movies list map */}
      <div className="movie-list">
        {movies.map((movie) => (
          <div key={movie._id} className="movie-card">
            <h3 className="movie-title">{movie.title}</h3>
            <p className="movie-description">{movie.description}</p>
            {movie.releaseDate && (
              <p className="release-date">
                Release Date:{" "}
                {new Date(movie.releaseDate).toISOString().split("T")[0]}
              </p>
            )}
            {/* edit */}
            <button className="edit-button" onClick={() => editMovie(movie)}>
              Edit
            </button>
            {/* delete */}
            <button
              className="delete-button"
              onClick={() => deleteMovie(movie._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieApp;
