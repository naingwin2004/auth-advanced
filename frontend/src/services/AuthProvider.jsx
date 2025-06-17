import { useEffect } from "react";
import toast from "react-hot-toast";
import { skipToken } from "@reduxjs/toolkit/query";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useCheckAuthQuery, useLogoutMutation } from "../services/authApi.js";
import { updateUser, logout } from "../app/features/auth/auth.js";

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const token = useSelector((state) => state.auth.token);

	const { data, error, isError, isLoading, isSuccess } = useCheckAuthQuery(
  token ? undefined : skipToken
);
	const [logoutApi] = useLogoutMutation();

	const handleLogout = async () => {
		console.log("logout in AuthProvider");
		try {
			await logoutApi().unwrap();
			localStorage.removeItem("token");
			localStorage.removeItem("auth-user");
			dispatch(logout());
		} catch (err) {
			console.error("Logout API failed:", err);
		}
	};

	useEffect(() => {
		if (isSuccess && data?.user) {
			toast.success(data?.message);
			dispatch(updateUser(data.user));
		}
	}, [isSuccess, data, dispatch]);

	useEffect(() => {
		if (isError && error?.status === 401) {
			handleLogout();
			navigate("/login");
		}
	}, [isError, error, logoutApi]);

	useEffect(() => {
		if (!token) {
			navigate("/login");
		}
	}, [token, navigate]);

	if (isLoading) {
		return (
			<div className='text-center mt-10'>Checking authentication...</div>
		);
	}

	return children;
};

export default AuthProvider;
