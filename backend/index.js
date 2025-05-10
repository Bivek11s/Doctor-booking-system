const express = require("express");
const connectDB = require("./config/db");
const path = require("path");
const dotenv = require("dotenv");
const fs = require("fs");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger.config.js");
dotenv.config();

connectDB();

const app = express();

//Middleware
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

//create upload folder if it doesnt exist
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");
if (!fs.existsSync("uploads/qualifications"))
  fs.mkdirSync("uploads/qualifications");
if (!fs.existsSync("uploads/profiles")) fs.mkdirSync("uploads/profiles");
//Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/appointments", require("./routes/appointments"));
app.use("/api/reviews", require("./routes/reviews"));
app.use("/api/prescriptions", require("./routes/prescriptions"));

//Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
