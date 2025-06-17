import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { useParams, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../../components/ui/button.jsx";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../../components/ui/form";
import { Input } from "../../components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../../components/ui/card";

import { useResetPasswordMutation } from "../../services/authApi.js";

const confirmPasswordFormSchema = z
	.object({
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const ConfirmPassword = () => {
	const form = useForm({
		resolver: zodResolver(confirmPasswordFormSchema),
		defaultValues: {
			password: "",
			confirmPassword: "",
		},
	});

	const [resetPassword, { data, error, isLoading }] =
		useResetPasswordMutation();
	const navigate = useNavigate();
	const { token } = useParams();

	const onSubmit = async (values) => {
		const { confirmPassword, ...data } = values;
		console.log("values", values);
		console.log("data", data);
		try {
			const res = await resetPassword({ token, data }).unwrap();
			toast.success(res?.message);
			navigate("/login");
		} catch (err) {
			console.log("err in ResetPassword page : ", err);
			toast.error(err?.data?.message || "fail resetPassword");
		}
	};

	return (
		<div className='flex items-center justify-center mx-3 my-auto'>
			<Card className='w-[400px]'>
				<CardHeader>
					<CardTitle>ResetPassword</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='password'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='confirmPassword'
								render={({ field }) => (
									<FormItem>
										<FormLabel>ConfirmPassword</FormLabel>
										<FormControl>
											<Input
												{...field}
												type='password'
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<Button
								type='submit'
								className='w-full'>
								ResetPassword
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ConfirmPassword;
