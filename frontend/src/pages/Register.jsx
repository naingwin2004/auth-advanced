import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../components/ui/form";
import { Input } from "../components/ui/input";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "../components/ui/card";

import { useRegisterMutation } from "../services/authApi.js";
import { setCredentials } from "../app/features/auth/auth.js";
import { useDispatch } from "react-redux";

const registerFormSchema = z
	.object({
		username: z.string().min(2, "Name must be at least 2 characters"),
		email: z.string().email("Invalid email address"),
		password: z.string().min(6, "Password must be at least 6 characters"),
		confirmPassword: z.string(),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

const Register = () => {
	const form = useForm({
		resolver: zodResolver(registerFormSchema),
		defaultValues: {
			username: "",
			email: "",
			password: "",
			confirmPassword: "",
		},
	});

	const [register, { data, isLoading }] = useRegisterMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (values) => {
		//unsend confirmPassword to server
		const { confirmPassword, ...data } = values;
		try {
			const res = await register(data).unwrap();
			localStorage.setItem("token", res?.token);
			localStorage.setItem("auth-user", JSON.stringify(res?.user));
			dispatch(setCredentials(res));
			toast.success(res?.message);
			navigate("/verify");
		} catch (err) {
			console.log("Error in Register page, fn onSubmit:", err);
			toast.error(
				err?.message || err?.data?.message || "Register failed",
			);
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen mx-3'>
			<Card className='w-[400px]'>
				<CardHeader>
					<CardTitle>Create Account</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
							<FormField
								control={form.control}
								name='username'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Full Name</FormLabel>
										<FormControl>
											<Input
												placeholder='Naing Win Aung'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='email'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input
												placeholder='example@email.com'
												{...field}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name='password'
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<FormControl>
											<Input
												type='password'
												{...field}
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
										<FormLabel>Confirm Password</FormLabel>
										<FormControl>
											<Input
												type='password'
												{...field}
											/>
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
				<CardFooter className='flex justify-center'>
					<p className='text-sm text-muted-foreground'>
						Already have an account?{" "}
						<Link to={"/login"}>
							<Button
								variant='link'
								className='p-0 h-auto'>
								Login
							</Button>
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Register;
