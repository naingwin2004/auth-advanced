import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const generateAccessToken = async (userId) => {
	const token = await jwt.sign({ userId }, process.env.ACCESS_SECRET, {
		expiresIn: "15min",
	});
	return token;
};

export const generateRefreshTokenAndSetCookie = async (res, userId) => {
	const token = await jwt.sign(
		{ userId },
		process.env.REFRESH_SECRET,
		{
			expiresIn: "30d",
		},
	);
	res.cookie("refreshToken", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict",
		maxAge: 7 * 24 * 60 * 60 * 1000,
	});
	return token;
};
