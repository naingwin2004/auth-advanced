import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { LoaderCircle } from "lucide-react";
import { Outlet, useNavigate, Link } from "react-router-dom";

import { Button } from "../components/ui/button.jsx";
import { ThemeProvider } from "../components/theme-provider";
import { ModeToggle } from "../components/mode-toggle.jsx";

import { useLogoutMutation } from "../services/authApi.js";
import { logout, setCredentials } from "../app/features/auth/auth.js";

const Main = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [logoutApi, { isLoading }] = useLogoutMutation();
	const token = useSelector((state) => state?.auth?.token);

	const onSubmit = async () => {
		try {
			const res = await logoutApi().unwrap();
			toast.success(res?.message);
			dispatch(logout());
			localStorage.removeItem("token");
			localStorage.removeItem("auth-user");
			navigate("/login");
		} catch (err) {
			console.log("Error in Main:", err);
			toast.error(err?.message || err?.data?.message || "Logout failed");
		}
	};

	return (
		<ThemeProvider
			defaultTheme='light'
			storageKey='vite-ui-theme'>
			<main className='flex flex-col min-h-screen mx-3'>
				<div className='flex justify-between items-center py-4'>
					<Link to={"/"} className='font-mono font-bold'>Auth-advanced</Link>
					<div className='flex justify-center space-x-4'>
						{token && (
							<Button
								onClick={onSubmit}
								disabled={isLoading}
								className='bg-destructive text-white'>
								{isLoading ? (
									<LoaderCircle className='animate-spin' />
								) : (
									"Logout"
								)}
							</Button>
						)}
						<ModeToggle />
					</div>
				</div>

				{/* This renders the child routes */}
				<Outlet />
			</main>
		</ThemeProvider>
	);
};

export default Main;
