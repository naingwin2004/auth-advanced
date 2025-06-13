import express from "express";

import {
	login,
	register,
	logout,
	verifyEmail,
	checkAuth,
	refresh,
	resendVerificationToken,
} from "../controllers/authController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/login", login);
authRouter.post("/register", register);
authRouter.post("/verifyEmail", verifyEmail);
authRouter.post("/logout", authMiddleware, logout);
authRouter.post("/resendVerificationToken", authMiddleware, resendVerificationToken);

authRouter.get("/checkAuth", authMiddleware, checkAuth);
authRouter.get("/refresh", authMiddleware, refresh);

export default authRouter;
