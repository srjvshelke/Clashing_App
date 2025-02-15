import { Router, Request, Response } from "express";
import { register } from "../models/loginmodel.js";

const router = Router();

// * Verify email
router.get("/verify-email", async (req: Request, res: Response) => {
  const { email, token } = req.query;
  if (email && token) {
    const user = await register.findOne({
      where: { email: email },

    });
    console.log(user);
    
    if (user) {
      // * Check both token
      if (token !== user.email_verify_token) {
        return res.redirect("/verify/error");
      }
      await register.updateOne(
        { id: user.id },
        {
          $set: {
            email_verified_at: new Date().toISOString(),
            email_verify_token: null
          }
        }
      );
      return res.redirect(`${process.env.CLIENT_URL}/login`);
    }
    return res.redirect("/verify/error");
  }

  return res.redirect("/verify-error");
});

// * Verify error page
router.get("/verify-error", (req: Request, res: Response) => {
  return res.render("auth/verifyEmailError");
});

export default router;
