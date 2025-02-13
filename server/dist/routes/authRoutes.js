import { Router } from "express";
import { registerSchema } from "../validations/authValidation.js";
import { register } from "../models/loginmodel.js";
import { formatError } from "../helper.js";
import { ZodError } from "zod";
const router = Router();
router.post('/register', async (req, res) => {
    try {
        const body = req.body;
        const payload = registerSchema.parse(body);
        console.log(payload);
        let user = await register.findOne({
            where: { email: payload.email },
        });
        console.log(user);
        if (!user) {
            await register.create(payload);
        }
        res.json(payload);
    }
    catch (error) {
        console.log("The error is ", error);
        if (error instanceof ZodError) {
            const errors = formatError(error);
            res.status(422).json({ message: "Invalid data", errors });
        }
        else {
            // logger.error({ type: "Register Error", body: JSON.stringify(error) });
            res
                .status(500)
                .json({ error: "Something went wrong.please try again!", data: error });
        }
    }
});
export default router;
