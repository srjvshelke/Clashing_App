import { Router, Response, Request } from "express";
import { registerSchema } from "../validations/authValidation.js";
import { register } from "../models/loginmodel.js";
const router = Router();


router.post('/',async(req:Request , res:Response)=>{
const body = req.body;
const payload = registerSchema.parse(body);
let user = await register.find({
  where: { email: payload.email },
})
}