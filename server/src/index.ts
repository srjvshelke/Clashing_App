import express,{Application,Request,Response} from "express";
import "dotenv/config";
const app : Application  = express();

const PORT = process.env.PORT || 7000;

 app.get("/",(req:Request , res:Response)=>{
return res.send("hey i am suraj") ;
 })


app.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
    

})