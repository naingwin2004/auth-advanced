import * as z from "zod";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import { LoaderCircle } from "lucide-react";
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

import { useForgotPasswordMutation } from "../services/authApi.js";

const resetPasswordFormSchema = z.object({
	email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
	const form = useForm({
		resolver: zodResolver(resetPasswordFormSchema),
		defaultValues: {
			email: "",
		},
	});

	const [forgotPassword, { data, error, isLoading }] =
		useForgotPasswordMutation();
	const onSubmit = async (values) => {
		try {
			const res = await forgotPassword(values).unwrap();
			toast.success(res?.message);
		} catch (err) {
			console.log("err in ForgotPassword page : ", err);
			toast.error(err?.data?.message || "fail forgotPassword");
		}
	};

	return (
		<div className='flex items-center justify-center mx-3 my-auto'>
			<Card className='w-[400px]'>
				<CardHeader>
					<CardTitle>ForgotPassword</CardTitle>
					<CardDescription className='text-gray-500'>
						Please enter the account you want to retrieve the
						password for
					</CardDescription>
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
							<Button
								type='submit'
								disabled={isLoading}
								className='w-full'>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"Submit"
								)}
							</Button>
						</form>
					</Form>
				</CardContent>
			</Card>
		</div>
	);
};

export default ForgotPassword;
