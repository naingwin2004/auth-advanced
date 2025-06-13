import bcrypt from "bcryptjs";

import User from "../models/userSchema.js";
import {
	generateAccessToken,
	generateRefreshTokenAndSetCookie,
} from "../utils/jwt.js";
import { sendVerificationEmail } from "../nodemailer/email.js";

export const register = async (req, res) => {
	const { username, email, password } = req.body;

	try {
		if (!email || !password || !username) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}

		const isUserExisted = await User.findOne({ email });
		if (isUserExisted) {
			return res.status(400).json({ message: "User already exists" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		const hashedOtp = await bcrypt.hash(otp, 10);

		const user = await User.create({
			username,
			email,
			password: hashedPassword,
			verificationToken: hashedOtp,
			verificationTokenExpiresAt: Date.now() + 15 * 60 * 1000, //15min
		});
		await user.save();

		const accessToken = await generateAccessToken(user);
		await generateRefreshTokenAndSetCookie(res, user);

		await sendVerificationEmail(res, user.email, otp);

		return res.status(201).json({
			message: "User Created Successfully",
			user: {
				...user._doc,
				password: undefined,
				_v: undefined,
			},
			token: accessToken,
		});
	} catch (err) {
		console.log("Error in register :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const login = async (req, res) => {
	const { email, password } = req.body;
	try {
		if (!email || !password) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({ message: "email doesn't exists" });
		}

		const isValidPassword = await bcrypt.compare(password, user.password);
		if (!isValidPassword) {
			return res.status(400).json({ message: "Invalid credential" });
		}

		const accessToken = await generateAccessToken(user);
		const refreshToken = await generateRefreshTokenAndSetCookie(res, user);

		return res.status(200).json({
			message: "login successfully",
			user: {
				...user._doc,
				password: undefined,
				_v: undefined,
			},
			token: accessToken,
		});
	} catch (err) {
		console.log("Error in login :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const verifyEmail = async (req, res) => {
	const { code, email } = req.body;
	try {
		if (!email || !code) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: "User doesn't exists",
			});
		}

		const isValidToken = await bcrypt.compare(code, user.verificationToken);

		if (!isValidToken) {
			return res.status(400).json({
				message: "Invalid code",
			});
		}
		if (user.verificationTokenExpiresAt < Date.now()) {
			return res.status(400).json({
				message: "Expired verification code, Try resend code",
			});
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;

		await user.save();

		return res.status(201).json({
			message: "Email Verify Successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (err) {
		console.log("Error in verifyEmail :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const checkAuth = async (req, res) => {
	const userId = req.userId;
	try {
		const user = await User.findById(userId).select("-password");
		if (!user) {
			return res.status(400).json({
				message: "Unauthorized User",
			});
		}
		return res.status(200).json({
			message: "User authenticated",
			user,
		});
	} catch (err) {
		console.log("Error in checkAuth :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const refresh = async (req, res) => {
	try {
		const token = req.cookies.refreshToken;
		if (!token) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No token provided" });
		}

		jwt.verify(token, process.env.REFRESH_SECRET, async (err, decode) => {
			if (err) {
				return res
					.status(403)
					.json({ message: "Invalid or token expired" });
			}
			const newAccessToken = await generateAccessToken(decode);
			return res.status(200).json({ token: newAccessToken });
		});
	} catch (err) {
		console.log("Error in refresh :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const resendVerificationToken = async (req, res) => {
	const { email } = req.body;

	try {
		if (!email) {
			return res.status(400).json({
				message: "All fields are required",
			});
		}
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(404).json({
				message: "User doesn't exists",
			});
		}
		if (user.isVerified) {
			return res.status(400).json({
				message: "somthing wrong ?",
			});
		}
		if (user.verificationTokenExpiresAt > Date.now()) {
			return res.status(400).json({
				message:
					"Verification code is not Expired, please check your email",
			});
		}

		const otp = Math.floor(100000 + Math.random() * 900000).toString();

		const hashedOtp = await bcrypt.hash(otp, 10);

		user.verificationToken = hashedOtp;
		user.verificationTokenExpiresAt = Date.now() + 15 * 60 * 1000; //15min
		await user.save();

		await sendVerificationEmail(res, user.email, otp);

		return res.status(201).json({
			message: "resend code compleate, check your email",
			verificationTokenExpiresAt: user.verificationTokenExpiresAt,
		});
	} catch (err) {
		console.log("Error in resendVerificationToken :", err.message);
		return res.status(500).json({ message: "Internal Server Error" });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("refreshToken");
	res.status(200).json({ success: true, message: "Logout Successfully" });
};
