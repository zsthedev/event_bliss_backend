import { app } from "./app.js";
import { connectDB } from "./config/database.js";
import cloudinary from "cloudinary";
import nodecron from "node-cron";
// import { Stats } from "./models/Stats.js";
connectDB();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// nodecron.schedule("0 0 0 1 * *", async () => {
//   try {
//     await Stats.create({});
//   } catch (error) {
//     console.log(error);
//   }
// });

// const temp = async () => {
//   await Stats.create({});
// };

// temp();
app.listen(process.env.PORT, () => {
  console.log("Server is working on: ", process.env.PORT);
});
