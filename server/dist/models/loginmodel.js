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
    password_reset_token: {
        type: String,
    },
    token_send_at: {
        type: Date
    },
    email_verified_at: {
        type: Date
    },
    email_verify_token: {
        type: String,
    },
    created_at: {
        type: Date,
    },
    Clash: []
});
export const register = mongoose.models.register || mongoose.model("register", loginmodel);
