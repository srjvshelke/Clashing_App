import express, { Request, Response } from "express";
import "dotenv/config";
import cors from "cors";

// import { mongobconnect } from "./lib/db.js";
import * as path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import { dirname } from "path";
import ejs from 'ejs';
import { sendMail } from "./lib/mail.js";

import Routes from "./routes/index.js" ;
const app = express();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// * Set View engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));


//routes
app.use(Routes)

mongoose.Promise = Promise;
// mongobconnect().then(() => {
//     console.log("mongodb connected");

// }).catch((error) => {
//     console.log(`mongo error => ${error}`);
// })
mongoose.connect(process.env.connectionStr as string).then(() => {
    console.log("mongodb connected");
}).catch((error) => {
    console.log(`mongo error => ${error}`);
});
const PORT = process.env.PORT || 7000;

// app.get("/", (req: Request, res: Response) => {
//     res.send("hey i am suraj");
// })
app.get("/", async (req: Request, res: Response) => {
    // const html = await ejs.renderFile(
    //     __dirname + `/views/emails/welcome.ejs`,{name:"suraj"}
    //   );
    //   await sendMail("nocateb901@shouxs.com","email testing",html);
    // await emailQueue.add(emailQueueName,{to:"xenopav840@prorsd.com",subject :"queue email testing",body:html})
    //   res.send({msg:"email send succefully"})
    res.render("emails/welcome",{name:"suraj"}) ;
    
});



// * Set Queue
import "./jobs/index.js";
import { emailQueue, emailQueueName } from "./jobs/EmailQueue.js";
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
})


