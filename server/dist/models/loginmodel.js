import mongoose from "mongoose";
const loginmodel = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    confirm_password: {
        type: String,
        require: true
    },
});
export const register = mongoose.models.login || mongoose.model("register", loginmodel);
