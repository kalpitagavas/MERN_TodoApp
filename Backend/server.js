const express = require("express");
const app = express();
const connect = require("./config/db");
require("dotenv").config();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Dashboard");
});
app.get("/login", (req, res) => {
  res.send("Login");
});
app.get("/signup", (req, res) => {
  res.send("Signup");
});

const serverDB = async () => {
  try {
    await connect();
    app.listen(8080, () => {
      console.log(`Server is connected Successfully ${8080}`);
    });
  } catch (err) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
serverDB();
