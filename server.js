const express = require("express");
const colors = require("colors");
const moragan = require("morgan");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require('path');

//dotenv conig
dotenv.config();

//mongodb connection
connectDB();

//rest obejct
const app = express();

//middlewares
app.use(express.json());
app.use(moragan("dev"));
app.use(cors({
  origin: 'https://capstone-5310-pet-grooming-appointment-fhtq.onrender.com'
}));

//routes
//user routes
const userRoutes = require("./routes/userRoutes");
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/admin", require("./routes/adminRoutes"));
app.use("/api/v1/groomer", require("./routes/groomerRoutes"));

// Add this error handling middleware after your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    success: false,
    message: "Something broke!",
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Add this for handling 404
app.use((req, res) => {
  res.status(404).send({
    success: false,
    message: "API endpoint not found"
  });
});

// Serve static files from the React app in production
if (process.env.NODE_ENV === 'production') {
    // Serve static files
    app.use(express.static(path.join(__dirname, './client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'));
    });
}

//port
const PORT = process.env.PORT || 8080;
//listen port
app.listen(PORT, () => {
  console.log(
    `Server Running in ${process.env.NODE_ENV} Mode on port ${PORT}`
      .bgCyan.white
  );
});