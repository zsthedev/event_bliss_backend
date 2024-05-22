import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import { ErrorMiddleware } from "./middlewares/Error.js";

export const app = express();

config({
  path: "./config/config.env",
});

app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/webhook") {
    next();
  } else {
    express.json()(req, res, next);
  }
});

app.use(
  express.urlencoded({
    extended: true,
  })
);
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173/",
  "http://localhost:5173",
  "https://eventblissfyp.netlify.app/",
  "https://eventblissfyp.netlify.app",
  "https://eventblissfypzs.netlify.app/",
  "https://eventblissfypzs.netlify.app",

];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(cookieParser());

import authRouter from "./routes/authRoutes.js";
import menuRouter from "./routes/menuRoutes.js";
import eventRouter from "./routes/eventRoutes.js";
import decorRouter from "./routes/decorRoute.js";
import requestRouter from "./routes/requestRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import otherRouter from "./routes/otherRoutes.js";
import dealRouter from "./routes/dealRoutes.js";

app.use("/api/v1", authRouter);
app.use("/api/v1", menuRouter);
app.use("/api/v1", eventRouter);
app.use("/api/v1", decorRouter);
app.use("/api/v1", requestRouter);
app.use("/api/v1", paymentRouter);
app.use("/api/v1", otherRouter);
app.use("/api/v1", dealRouter);


app.get("/", (req, res) => {
  res.send(
    `<h1>Backend is working fine <a href=${process.env.FRONTEND_URL}>Click here to Visit Frontend</a></h1> `
  );
});

app.use(ErrorMiddleware);
