import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";

import authRouter from "./routes/auth.js";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
	cors({
		origin: process.env.CLIENT_URL || "http://localhost:5173",
		credentials: true,
	}),
);

app.use("/api/v1/auth", authRouter);

export default app;
