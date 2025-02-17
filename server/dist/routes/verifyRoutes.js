import { Router } from "express";
import { register } from "../models/loginmodel.js";
const router = Router();
// * Verify email
router.get("/verify-email", async (req, res) => {
    const { email, token } = req.query;
    console.log(`email : ${email} ,token:${token}`);
    if (email && token) {
        const user = await register.findOne({
            email: email
        });
        console.log(user);
        if (user) {
            // * Check both token
            if (token !== user.email_verify_token) {
                console.log("inside1");
                return res.redirect("/verify-error");
            }
            await register.updateOne({ _id: user._id }, {
                $set: {
                    email_verified_at: new Date().toISOString(),
                    email_verify_token: null
                }
            }, { upsert: true });
            return res.redirect(`${process.env.CLIENT_URL}/login`);
        }
        console.log("inside2");
        return res.redirect("/verify-error");
    }
    console.log("inside3");
    return res.redirect("/verify-error");
});
// * Verify error page
router.get("/verify-error", (req, res) => {
    return res.render("auth/verifyEmailError");
});
export default router;
