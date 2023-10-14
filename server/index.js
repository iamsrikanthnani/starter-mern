const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 3030;

// Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to your MongoDB database
mongoose.connect(
  "mongodb+srv://srikanthnani1202:noThisIsNotMyPasswordButItWillWork@cluster0.peguyze.mongodb.net/",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const moviesRouter = require("./routes/movies"); // Create this route file
app.use("/api/movies", moviesRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
