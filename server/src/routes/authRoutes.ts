import { Router, Response, Request } from "express";
import { forgetPasswordSchema, loginSchema, registerSchema, resetPasswordSchema } from "../validations/authValidation.js";
import { register } from "../models/loginmodel.js";
import { checkDateHourDifference, formatError, generateRandomNum, renderEmailEjs } from "../helper.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { emailQueue, emailQueueName } from "../jobs/EmailQueue.js";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/AuthMiddleware.js";
import { testQueue, testQueueName } from "../jobs/TestQueue.js";
import { authLimiter } from "../lib/rateLimit.js";

const router = Router();
type JWTPayload = {
  id: string;
  name: string;
  email: string;
};
router.post('/register', async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const payload = registerSchema.parse(body);
    console.log(payload);

    let user = await register.findOne({
      email: payload.email
    })
    console.log(user);

    if (user != null) {

      return res.status(422).json({
        errors: {
          email: "Email already taken.please use another one.",
        },
      });
    }

    //encrypt password

    const salt = await bcrypt.genSalt(10);
    payload.password = await bcrypt.hash(payload.password, salt);
    payload.confirm_password = payload.password;
    const id = generateRandomNum();
    const token = await bcrypt.hash(id, salt);
    const url = `${process.env.APP_URL}/verify-email/?email=${payload.email}&token=${token}`;
    const html = await renderEmailEjs("verify-email", {
      name: payload.name,
      url: url,
    });

    console.log(url);

    await emailQueue.add(emailQueueName, {
      to: payload.email,
      subject: "Please verify your email Clash",
      body: html,
    });
    Object.assign(payload, { email_verify_token: token });

    await register.create(payload)
    return res.json({ message: "User created successfully!" });


  } catch (error) {
    console.log(req.body);


    console.log("The error is ", error);
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
    } else {
      // logger.error({ type: "Register Error", body: JSON.stringify(error) });
      res
        .status(500)
        .json({ error: "Something went wrong.please try again!", data: error });
    }

  }

}
);



router.post("/login", async (req: Request, res: Response) => {
  try {
    const { body } = req;
    const payload = loginSchema.parse(body);

    const user = await register.findOne({ email: payload.email });
    console.log(user);

    if (!user) {
      console.log("no user");

      // return res.status(404).json({ message: "No user found with this email." });
      return res.status(422).json({
        errors: {
          email: "No user found with this email.",
        },
      });

    }

    if (!user.email_verified_at) {
      console.log('inside1');
      return res.status(422).json({
        errors: {
          email: "Email is not verified yet. Please check your email and verify it.",
        },
      });

    }

    const isPasswordValid = await bcrypt.compare(payload.password, user.password);
    console.log(isPasswordValid);

    if (!isPasswordValid) {
      console.log('inside2');
      return res.status(422).json({ errors: { email: "Invalid Credentials.", password: "Invalid Credentials." } });
    }

    const jwtPayload: JWTPayload = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
    };

    const token = jwt.sign(jwtPayload, process.env.JWT_SECRET as string, {
      expiresIn: "365d",
    });
    console.log(token);

    let resf = {
      message: "Logged in successfully!",
      data: {
        id: user._id,
        email: user.email,
        name: user.name,
        token: `Bearer ${token}`,
      },
    }
    console.log(resf);
    return res.json(resf);
  } catch (error) {
    console.log(req.body);
    console.log("The error is ", error);
    if (error instanceof ZodError) {
      const errors = formatError(error);
      res.status(422).json({ message: "Invalid data", errors });
    } else {
      // logger.error({ type: "Register Error", body: JSON.stringify(error) });
      res
        .status(500)
        .json({ error: "Something went wrong.please try again!", data: error });
    }

  }
});

router.post(
  "/check/login",
  // authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = loginSchema.parse(body);

      // * Check if user exist
      let user = await register.findOne({ email: payload.email });
      console.log(user);
      
      if (!user) {
        return res.status(422).json({
          errors: {
            email: "No user found with this email.",
          },
        });
      }

      // * Check email verified or not
      if (!user.email_verified_at) {
        return res.status(422).json({
          errors: {
            email:
              "Email is not verified yet.please check your email and verify your email.",
          },
        });
      }

      // Check password
      if (!bcrypt.compareSync(payload.password, user.password)) {
        return res.status(422).json({
          errors: {
            email: "Invalid Credentials.",
          },
        });
      }

      let resf = {
        message: "Logged in successfully!",
        data: {
          id: user._id,
          email: user.email,
          name: user.name
        },
      }
      return res.json(resf);
    } catch (error) {
      console.log(req.body);
  
  
      console.log("The error is ", error);
      if (error instanceof ZodError) {
        const errors = formatError(error);
        res.status(422).json({ message: "Invalid data", errors });
      } else {
        // logger.error({ type: "Register Error", body: JSON.stringify(error) });
        res
          .status(500)
          .json({ error: "Something went wrong.please try again!", data: error });
      }
  
    }
  }
);

router.get("/user", authMiddleware, async (req: Request, res: Response) => {
  const user = req.user;
  await testQueue.add(testQueueName, user);
  return res.json({ message: "Fetched", user });
});

// * Forget password
router.post(
  "/forget-password",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = forgetPasswordSchema.parse(body);
      const user = await register.findOne({ email: payload.email });
      if (!user) {
        return res.status(422).json({
          message: "Invalid data",
          errors: {
            email: "No Account found with this email!",
          },
        });
      }

      const id = generateRandomNum();
      const salt = await bcrypt.genSalt(10);
      const token = await bcrypt.hash(id, salt);

      await register.updateOne(
        { email: payload.email },
        {
          $set: {
            password_reset_token: token,
            token_send_at: new Date().toISOString()
          }
        },
        { upsert: true }
      );

      const url = `${process.env.CLIENT_URL}/reset-password?email=${payload.email}&token=${token}`;
      const html = await renderEmailEjs("forget-password", {
        name: user.name,
        url: url,
      });
      await emailQueue.add(emailQueueName, {
        to: payload.email,
        subject: "Forgot Password",
        html: html,
      });

      return res.json({
        message: "Email sent successfully!! please check your email.",
      });
    } catch (error) {
      console.log(req.body);
  
  
      console.log("The error is ", error);
      if (error instanceof ZodError) {
        const errors = formatError(error);
        res.status(422).json({ message: "Invalid data", errors });
      } else {
        // logger.error({ type: "Register Error", body: JSON.stringify(error) });
        res
          .status(500)
          .json({ error: "Something went wrong.please try again!", data: error });
      }
  
    }
  }
);



// *Reset Password routes
router.post(
  "/reset-password",
  authLimiter,
  async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const payload = resetPasswordSchema.parse(body);
      const user = await register.findOne({ email: payload.email});

      if (!user) {
        return res.status(422).json({
          errors: {
            email: "No Account found with this email.",
          },
        });
      }

      // * Check token
      if (payload.token !== user.password_reset_token) {
        return res.status(422).json({
          errors: {
            email: "Please make sure you are using correct url.",
          },
        });
      }

      const hoursDiff = checkDateHourDifference(user.token_send_at);
      
      if (hoursDiff > 2) {
        return res.status(422).json({
          errors: {
            email:
              "Password Reset token got expire.please send new token to reset password.",
          },
        });
      }

      // * Update the password
      const salt = await bcrypt.genSalt(10);
      const newPass = await bcrypt.hash(payload.password, salt);

      await register.updateOne(
        { email: payload.email },
        {
          $set: {
            password: newPass,
            password_reset_token: null,
            token_send_at: null,
          }
        },
        { upsert: true }
      );

      return res.json({
        message: "Password reset successfully! please try to login now.",
      });
    } catch (error) {
      console.log(req.body);
      console.log("The error is ", error);
      if (error instanceof ZodError) {
        const errors = formatError(error);
        res.status(422).json({ message: "Invalid data", errors });
      } else {
        // logger.error({ type: "Register Error", body: JSON.stringify(error) });
        res
          .status(500)
          .json({ error: "Something went wrong.please try again!", data: error });
      }
  
    }
  }
);



export default router;


// @ -0,0 +1,22 @@
// PORT=4000
// username=suraj123
// password=suraj123
// connectionStr = mongodb+srv://suraj123:suraj123@cluster0.l5acg.mongodb.net/clashing_App?retryWrites=true&w=majority&appName=Cluster0
// #  // "server": "nodemon ./dist/index.js",
// #     // "watch": "tsc -w",
// #     // "build": "concurrently \"tsc\" \"npm run copy-files\" "



// # //redis
// REDIS_HOST = localhost
// # docker run -d --name redis-server -p 6379:6379 -p 8001:8001  redis/redis-stack:latest


// APP_URL = http://localhost:4000
// CLIENT_URL = http://localhost:3000
// JWT_SECRET= "dahdsgad524264524@#@#"