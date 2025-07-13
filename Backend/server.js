const express = require("express");
const app = express();
const connect = require("./config/db");
const cookieParser = require("cookie-parser");
require("dotenv").config();

// Swagger Docs
const { swaggerui, specs } = require("./docs/swagger");

// Routers
const authRouter = require("./router/auth.route");
const { todorouter } = require("./router/todo.route");

// Middleware
const errorHandling = require("./middleware/errorHandling");
const limiter = require("./middleware/rateLimiter");

// Global Middleware
app.use(express.json());
app.use(cookieParser());
app.use(limiter); // Global rate limiter (you can also apply per-route)

//  Swagger
app.use("/api-docs", swaggerui.serve, swaggerui.setup(specs));

//  Routes
app.use("/auth", limiter, authRouter); // Auth routes
app.use("/todo", todorouter); // Todo routes

//  Dummy check
app.get("/", (req, res) => {
  res.send("Dashboard is running ");
});

//  Error Handling (Always last)
app.use(errorHandling);

//  DB + Server Start
const serverDB = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(` Server running at http://localhost:${process.env.PORT}`);
    });
  } catch (err) {
    console.error(" DB connection failed:", err.message);
    process.exit(1);
  }
};

serverDB();
