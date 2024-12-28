import mongoose from "mongoose";

const loginmodel = new mongoose.Schema({
    Name: {
        type: String,
        require: true
    },
    Username: {
        type: String,
        require: true
    },
    Password: {
        type: String,
        require: true
    },
    Confirm_Password: {
        type: String,
        require: true
    },
})

 export const register = mongoose.models.login || mongoose.model("register", loginmodel);