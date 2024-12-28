import { register } from "../models/loginmodel"
export async function createuser() {
    await register.create({ Name: 'suraj', Username: "surajvs", Password: "123", Confirm_Password: "1234" });
    // const data = await loginSchema.find();
    console.log("data");


    // return NextResponse.json({result:data});
}
