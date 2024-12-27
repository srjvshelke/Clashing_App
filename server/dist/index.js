import express from "express";
import "dotenv/config";
const app = express();
const PORT = process.env.PORT || 7000;
app.get("/", (req, res) => {
    return res.send("hey i am suraj");
});
app.listen(PORT, () => {
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});
