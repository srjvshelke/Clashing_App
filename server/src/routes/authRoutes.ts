import { Router, Response, Request } from "express";
import { loginSchema, registerSchema } from "../validations/authValidation.js";
import { register } from "../models/loginmodel.js";
import { formatError, generateRandomNum, renderEmailEjs } from "../helper.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { emailQueue, emailQueueName } from "../jobs/EmailQueue.js";
import jwt from "jsonwebtoken";

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

      return res.status(422).json({ errors: { email: "Invalid Credentials." } });
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