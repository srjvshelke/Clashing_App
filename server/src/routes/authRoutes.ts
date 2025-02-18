import { Router, Response, Request } from "express";
import { registerSchema } from "../validations/authValidation.js";
import { register } from "../models/loginmodel.js";
import { formatError, generateRandomNum, renderEmailEjs } from "../helper.js";
import { ZodError } from "zod";
import bcrypt from "bcrypt";
import { emailQueue, emailQueueName } from "../jobs/EmailQueue.js";

const router = Router();


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
    Object.assign(payload, {email_verify_token : token});

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



export default router;