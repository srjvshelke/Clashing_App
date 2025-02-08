import { Job, Queue, Worker } from "bullmq";
import { sendMail } from "../lib/mail.js";
import { defaultQueueConfig, redisConnection } from "../lib/queue.js";

export const emailQueueName = "emailQueue";

export const emailQueue = new Queue(emailQueueName, {
  connection: redisConnection,
  defaultJobOptions: defaultQueueConfig,
});

interface emaildatatype{
  to:string,
  subject:string,
  body:string
}

// * Workers
export const queueworker = new Worker(
  emailQueueName,
  async (job: Job) => {
    const data:emaildatatype = job.data;
    await sendMail(data.to, data.subject, data.body);
    console.log(data);
    
  },
  { connection: redisConnection }
);
