const mongoose = require("mongoose");

const conn = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://jucse28384:1ArYSTpDwWAwS6gm@todolist.sj39j7c.mongodb.net/?retryWrites=true&w=majority"
    );
    console.log("Connected to the DB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
  }
};

conn();


