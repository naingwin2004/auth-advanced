import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useCheckAuthQuery, useLogoutMutation } from "../services/authApi.js";
import { updateUser, logout } from "../app/features/auth/auth.js";
import { useEffect } from "react";

const AuthProvider = ({ children }) => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const { data, error, isError, isLoading, isSuccess } = useCheckAuthQuery();
	const [logoutApi] = useLogoutMutation();

	useEffect(() => {
		if (isSuccess && data?.user) {
			toast.success(data?.message);
			dispatch(updateUser(data.user));
		}
	}, [isSuccess, data, dispatch]);

	useEffect(() => {
		if (isError && error?.data) {
			console.log("logout in AuthProvider");
			logoutApi(); // API logout
			localStorage.removeItem("token");
			localStorage.removeItem("auth-user");
			dispatch(logout());
			navigate("/login");
		}
	}, [error, dispatch, navigate, logoutApi]);

	if (isLoading) {
		return (
			<div className='text-center mt-10'>Checking authentication...</div>
		);
	}

	return children;
};

export default AuthProvider;
