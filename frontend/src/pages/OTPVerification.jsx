import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "../components/ui/input-otp";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";

import {
	useVerifyEmailMutation,
	useResendVerificationTokenMutation,
} from "../services/authApi.js";
import { setCredentials, updateUser } from "../app/features/auth/auth.js";
import { formatDate } from "../lib/formatDate.js";

const otpFormSchema = z.object({
	code: z
		.string()
		.nonempty({ message: "OTP is required." })
		.length(6, { message: "OTP must be exactly 6 characters." }),
});

const OTPVerification = () => {
	const form = useForm({
		resolver: zodResolver(otpFormSchema),
		defaultValues: {
			code: "",
		},
	});

	const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
	const [resendOtp, { isLoading: resendLoading }] =
		useResendVerificationTokenMutation();

	const email = useSelector((state) => state?.auth?.user?.email);
	const verificationTokenExpiresAt = useSelector(
		(state) => state?.auth?.user?.verificationTokenExpiresAt,
	);

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (values) => {
		const payloads = { ...values, email };

		try {
			const res = await verifyEmail(payloads).unwrap();
			localStorage.setItem("auth-user", JSON.stringify(res?.user));
			dispatch(setCredentials(res));
			toast.success(res?.message);
			navigate("/");
		} catch (err) {
			console.log("Error in otp-verification page, fn onSubmit:", err);
			toast.error(err?.message || err?.data?.message || "verify failed");
		}
	};

	const handleResend = async () => {
		try {
			const res = await resendOtp({ email }).unwrap();

			const newExpiresAt = res?.verificationTokenExpiresAt;

			const oldUser = JSON.parse(localStorage.getItem("auth-user"));
			const updatedUser = {
				...oldUser,
				verificationTokenExpiresAt: newExpiresAt,
			};
			localStorage.setItem("auth-user", JSON.stringify(updatedUser));

			dispatch(updateUser({ verificationTokenExpiresAt: newExpiresAt }));

			toast.success(res?.message);
		} catch (err) {
			console.log("Error in otp-verification page, fn onSubmit:", err);
			toast.error(err?.message || err?.data?.message || "resend failed");
		}
	};

	return (
		<div className='flex items-center justify-center my-auto mx-3'>
			<Card className='w-[400px]'>
				<CardHeader>
					<CardTitle>Verify Your Email</CardTitle>
					<CardDescription>
						We've sent a 6-digit code to your email
					</CardDescription>
					<CardDescription>
						ExpiresAt : {formatDate(verificationTokenExpiresAt)}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-6'>
							<FormField
								control={form.control}
								name='code'
								render={({ field }) => (
									<FormItem className='flex flex-col items-center'>
										<FormLabel>One-Time Password</FormLabel>
										<FormControl>
											<InputOTP
												maxLength={6}
												{...field}>
												<InputOTPGroup>
													{[...Array(6)].map(
														(_, index) => (
															<InputOTPSlot
																key={index}
																index={index}
																className='border-border'
															/>
														),
													)}
												</InputOTPGroup>
											</InputOTP>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type='submit'
								disabled={isLoading}
								className='w-full'>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"Register"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className='flex justify-center items-center'>
					<p className='text-sm text-muted-foreground'>
						Didn't receive a code?{" "}
						<Button
							variant='link'
							onClick={handleResend}
							disabled={resendLoading}
							className='p-0 h-auto'>
							Resend
						</Button>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};
export default OTPVerification;
