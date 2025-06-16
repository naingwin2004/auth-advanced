import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: "naingwin.dev@gmail.com",
		pass: process.env.MAIL_PASS,
	},
});

export const sendVerificationEmail = async (res, email, plainToken) => {
	try {
		await transporter.sendMail({
			from: "naingwin.dev@gmail.com",
			to: email,
			subject: "Verify Your Token",
			html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #333;">Welcome to <span style="color: #007BFF;">auth-advanced</span>!</h2>
    <p>Thanks for testing my <strong>auth-advanced</strong> app.</p>
    <p>Please use the following verification token to complete your registration:</p>
    <div style="background-color: #eef; padding: 10px 20px; margin: 20px 0; border-left: 4px solid #007BFF; font-size: 18px;">
      <strong>${plainToken}</strong>
    </div>
    <p style="color: #666;">If you did not request this, please ignore this email.</p>
    <hr style="margin-top: 30px;" />
    <p style="font-size: 12px; color: #aaa;">&copy; 2025 auth-advanced by NaingWinAung</p>
  </div>
`,
		});
	} catch (error) {
		console.log("Error sending verification email", error);
		return res
			.status(400)
			.json({ message: "Error sending verification email :", error });
	}
};

export const sendResetPassword = async (res, token,email) => {
	try {
		await transporter.sendMail({
			from: "naingwin.dev@gmail.com",
			to: email,
			subject: "Verify Your Token",
			html: `
			<div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f9f9f9; border: 1px solid #ddd; border-radius: 8px;">
  <h2 style="color: #333;">Reset your <span style="color: #007BFF;">auth-advanced</span> password</h2>
  <p>We received a request to reset your password.</p>
  <p>Click the button below to reset your password:</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="${process.env.CLIENT_URL}/resetPassword/${token}" target="_blank" style="background-color: #007BFF; color: white; padding: 12px 20px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
      Reset Password
    </a>
  </div>

  <p style="color: #666;">If you did not request a password reset, please ignore this email.</p>
  <hr style="margin-top: 30px;" />
  <p style="font-size: 12px; color: #aaa;">&copy; 2025 auth-advanced by NaingWinAung</p>
</div>
`,
		});
	} catch (error) {
		console.log("Error sending resetPassword email", error);
		return res
			.status(400)
			.json({ message: "Error sending resetPassword email :", error });
	}
};
