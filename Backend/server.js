const express = require("express");
const app = express();
const connect = require("./config/db");
const cookieparser = require("cookie-parser");

require("dotenv").config();

app.use(express.json());
app.use(cookieparser());

const authRouter = require("./router/auth.route");

app.use("/auth", authRouter);
app.get("/", (req, res) => {
  res.send("Dashboard");
});

const serverDB = async () => {
  try {
    await connect();
    app.listen(process.env.PORT, () => {
      console.log(
        `Server is connected Successfully at http://localhost:${process.env.PORT}`
      );
    });
  } catch (err) {
    console.error("DB connection failed:", error.message);
    process.exit(1);
  }
};
serverDB();
