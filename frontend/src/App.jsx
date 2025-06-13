import {
	createBrowserRouter,
	RouterProvider,
	Navigate,
} from "react-router-dom";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import OTPVerification from "./pages/otp-verification.jsx";

import Main from "./layout/Main.jsx";
import Home from "./layout/Home.jsx";

import {
	ProtectedRoute,
	ProtectedUnverifiedOnly,
	RedirectAuthenticatedUser,
} from "./components/ProtectedRoute.jsx";

const App = () => {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Main />,
			children: [
				{
					index: true,
					element: (
						<ProtectedRoute>
						
							<Home />
						</ProtectedRoute>
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
					path: "/verify",
					element: (
						<ProtectedUnverifiedOnly>
							<OTPVerification />
						</ProtectedUnverifiedOnly>
					),
				},
			],
		},
	]);
	return <RouterProvider router={router} />;
};

export default App;
