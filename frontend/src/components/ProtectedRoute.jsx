import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";


export const RedirectAuthenticatedUser = ({ children }) => {
	const user = useSelector((state) => state.auth.user);

	if (user && user?.isVerified) {
		return (
			<Navigate
				to='/'
				replace
			/>
		);
	}

	if (user && !user?.isVerified) {
		return (
			<Navigate
				to='/verify'
				replace
			/>
		);
	}

	return children;
};

export const ProtectedUnverifiedOnly = ({ children }) => {
	const user = useSelector((state) => state.auth.user);

	if (!user) {
		return (
			<Navigate
				to='/login'
				replace
			/>
		);
	}

	if (user && user.isVerified) {
		return (
			<Navigate
				to='/'
				replace
			/>
		);
	}

	return children;
};
