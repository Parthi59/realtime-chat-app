require("dotenv").config();
const mongoose = require("mongoose");

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Atlas Connected ✅");
    process.exit(0);
  })
  .catch((err) => {
    console.log("Connection Failed ❌");
    console.log(err.message);
    process.exit(1);
  });