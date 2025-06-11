import express from "express";

import {
	login,
	register,
	logout,
	verifyEmail,
	checkAuth,
	refresh,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/verifyEmail", verifyEmail);

authRouter.get("/checkAuth", authMiddleware, checkAuth);
authRouter.get("/refresh", authMiddleware, refresh);
authRouter.get("/logout", authMiddleware, logout);

export default authRouter;
