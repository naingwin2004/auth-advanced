import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";

import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import OTPVerification from "./pages/auth/OTPVerification.jsx";
import ForgotPassword from "./pages/auth/ForgotPassword.jsx";
import ResetPassword from "./pages/auth/ResetPassword.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";

import Main from "./layout/Main.jsx";
import Home from "./layout/Home.jsx";

import {
	ProtectedUnverifiedOnly,
	RedirectAuthenticatedUser,
} from "./components/ProtectedRoute.jsx";

import AuthProvider from "./services/AuthProvider.jsx";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Main />,
			errorElement: <NotFoundPage />,
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
						<RedirectAuthenticatedUser>
							<ForgotPassword />
						</RedirectAuthenticatedUser>
					),
				},
				{
					path: "/resetPassword/:token",
					element: (
						<RedirectAuthenticatedUser>
							<ResetPassword />
						</RedirectAuthenticatedUser>
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
