import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OTPVerification from "./pages/OTPVerification.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import ResetPassword from "./pages/ResetPassword.jsx";

import Main from "./layout/Main.jsx";
import Home from "./layout/Home.jsx";

import {
	ProtectedRoute,
	ProtectedUnverifiedOnly,
	RedirectAuthenticatedUser,
} from "./components/ProtectedRoute.jsx";

import AuthProvider from "./services/AuthProvider.jsx";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Main />,
			children: [
				{
					index: true,
					element: (
						<AuthProvider>
							<Home />
						</AuthProvider>
					),
				},
				{
					path: "/login",
					element: (
						<RedirectAuthenticatedUser>
							<Login />
						</RedirectAuthenticatedUser>
					),
				},
				{
					path: "/register",
					element: (
						<RedirectAuthenticatedUser>
							<Register />
						</RedirectAuthenticatedUser>
					),
				},
				{
					path: "/forgotPassword",
					element: (
						<>
							<ForgotPassword />
						</>
					),
				},
				{
					path: "/resetPassword/:token",
					element: (
						<>
							<ResetPassword />
						</>
					),
				},
				{
					path: "/verify",
					element: (
						<AuthProvider>
							<ProtectedUnverifiedOnly>
								<OTPVerification />
							</ProtectedUnverifiedOnly>
						</AuthProvider>
					),
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
};

export default App;
