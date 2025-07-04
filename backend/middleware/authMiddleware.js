import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
	try {
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			return res
				.status(401)
				.json({ message: "Unauthorized: No token provided" });
		}
		const token = authHeader.split(" ")[1];
		const decoded = jwt.verify(token, process.env.ACCESS_SECRET);


		if (!decoded.userId) {
			return res
				.status(401)
				.json({ message: "Unauthorized: UserId not found in token" });
		}

		req.userId = decoded.userId;
		next();
	} catch (err) {
		console.log("Error in authMiddleware:", err.message);
		if (err.name === "TokenExpiredError") {
			return res.status(403).json({ message: "TokenExpired" });
		}
		return res.status(403).json({ message: "Unauthorized: Invalid token" });
	}
};
