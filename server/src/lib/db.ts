import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";

const connectionStr = process.env.connectionStr as string;

mongoose.Promise = Promise;

const dbPromise = mongoose.connect(connectionStr).then(() => {
  console.log("✅ MongoDB connected");
  autoIncrement.initialize(mongoose.connection); 
});

export { mongoose, autoIncrement, dbPromise };
