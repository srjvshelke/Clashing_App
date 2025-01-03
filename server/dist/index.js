import express from "express";
import "dotenv/config";
// import { mongobconnect } from "./lib/db";
import * as path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// * Set View engine
app.set("view engine", "ejs");
app.set("views", path.resolve(__dirname, "./views"));
mongoose.Promise = Promise;
// mongobconnect().then(() => {
//     console.log("mongodb connected");
// }).catch((error) => {
//     console.log(`mongo error => ${error}`);
// })
mongoose.connect(process.env.connectionStr).then(() => {
    console.log("mongodb connected");
}).catch((error) => {
    console.log(`mongo error => ${error}`);
});
const PORT = process.env.PORT || 7000;
// app.get("/", (req: Request, res: Response) => {
//     res.send("hey i am suraj");
// })
app.get("/", async (req, res) => {
    res.render("welcome");
});
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
