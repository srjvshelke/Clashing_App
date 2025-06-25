import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
const connectionStr = process.env.connectionStr;
mongoose.Promise = Promise;
const autoIncrement = mongooseSequence(mongoose);
const dbPromise = mongoose.connect(connectionStr).then(() => {
    console.log("✅ MongoDB connected");
    // autoIncrement.initialize(mongoose.connection); 
});
export { mongoose, autoIncrement, dbPromise };
