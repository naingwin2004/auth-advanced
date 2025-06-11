import jwt from "jsonwebtoken";

export const generateAccessToken = async (user) => {
	const token = await jwt.sign(
		{ userId: user._id },
		process.env.ACCESS_SECRET,
		{
			expiresIn: "15min",
		},
	);
	return token;
};

export const generateRefreshTokenAndSetCookie = async (res, user) => {
	const token = await jwt.sign(
		{ userId: user._id },
		process.env.REFRESH_SECRET,
		{
			expiresIn: "30d",
		},
	);
	res.cookie("refershToken", token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		sameSite: "none",
		maxAge: 30 * 24 * 60 * 60 * 1000, // 30d
	});
	return token;
};
