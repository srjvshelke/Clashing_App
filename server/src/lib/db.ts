import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";



const connectionStr = process.env.connectionStr as string;

mongoose.Promise = Promise;

const dbPromise = mongoose.connect(connectionStr).then(() => {
  console.log("✅ MongoDB connected");
  const autoIncrement = mongooseSequence(mongoose.connection);
  // autoIncrement.initialize(mongoose.connection); 
});

export { mongoose, mongooseSequence, dbPromise };
