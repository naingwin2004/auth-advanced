import dotenv from "dotenv";

import app from "./app.js";
import {connectDB} from "./db/connectDB.js"

dotenv.config();

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  connectDB()
	console.log("Server is running on port :", PORT);
});
