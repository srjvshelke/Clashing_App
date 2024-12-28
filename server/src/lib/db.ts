import mongoose from "mongoose";
const connectionStr = process.env.connectionStr;

export  async function mongobconnect() {
    return await mongoose.connect(connectionStr);
}

// module.exports  = mongobconnect ;