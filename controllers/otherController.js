import OpenAI from "openai";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";

export const chat = catchAsyncError(async (req, res, next) => {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_KEY,
  });

  const completion = await openai.chat.completions.create({
    messages: [{ role: "system", content: "You are a helpful assistant." }],
    model: "gpt-3.5-turbo-16k",
  });

  res.status(200).json({
    success: true,
    message: completion.choices[0],
  });
});
