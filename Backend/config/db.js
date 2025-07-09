const mongoose = require("mongoose");

const connection = async () => {
  try {
    const connectionDB = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");
  } catch (err) {
    console.error("Error while connecting to DB:", err.message);
  }
};

module.exports = connection;
