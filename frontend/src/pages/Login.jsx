import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "../components/ui/button.jsx";
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

import { useLoginMutation } from "../services/authApi.js";
import { setCredentials } from "../app/features/auth/auth.js";
import { useDispatch } from "react-redux";

const loginFormSchema = z.object({
	email: z.string().email("Invalid email address"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

const Login = () => {
	const form = useForm({
		resolver: zodResolver(loginFormSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const [login, { data, isError, isLoading }] = useLoginMutation();
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const onSubmit = async (values) => {
		try {
			const res = await login(values).unwrap();
			localStorage.setItem("token", res?.token);
			localStorage.setItem("auth-user", JSON.stringify(res?.user));
			dispatch(setCredentials(res));
			toast.success(res?.message);
			navigate("/");
		} catch (err) {
			console.log("Error in Login page, fn onSubmit:", err);
			toast.error(err?.message || err?.data?.message || "Login failed");
		}
	};

	return (
		<div className='flex items-center justify-center min-h-screen mx-3'>
			<Card className='w-[400px]'>
				<CardHeader>
					<CardTitle>Login</CardTitle>
				</CardHeader>
				<CardContent>
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(onSubmit)}
							className='space-y-4'>
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
							<Button
								type='submit'
								className='w-full'
								disabled={isLoading}>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"Login"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
				<CardFooter className='flex flex-col justify-center'>
					<Button
						variant='link'
						className='text-sm'>
						Forgot password?
					</Button>
					<p className='text-sm text-muted-foreground'>
						Don't have an account?{" "}
						<Link to={"/register"}>
							<Button
								variant='link'
								className='p-0 h-auto'>
								Register
							</Button>
						</Link>
					</p>
				</CardFooter>
			</Card>
		</div>
	);
};

export default Login;
