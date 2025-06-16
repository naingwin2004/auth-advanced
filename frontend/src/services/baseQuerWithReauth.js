//import toast from "react-hot-toast";
import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { setCredentials, logout } from "../app/features/auth/auth.js";

export const baseQueryWithReauth = async (args, api, extraOptions) => {
	const baseQuery = fetchBaseQuery({
		baseUrl: import.meta.env.VITE_SERVER_URL,
		credentials: "include",
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token;
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	});

	let result = await baseQuery(args, api, extraOptions);

	if (
		result?.error?.status === 403 &&
		result?.error?.data?.message === "TokenExpired"
	) {
		const refreshResult = await baseQuery("/refresh", api, extraOptions);

		if (refreshResult?.data) {
			localStorage.setItem("token", refreshResult.data.newAccessToken);
			api.dispatch(
				setCredentials({ token: refreshResult.data.newAccessToken }),
			);

			result = await baseQuery(args, api, extraOptions);
			//toast.success("refresh token success");
		} else {
		  console.log("logout in baseQuerWithReauth");
			await baseQuery(
				{
					url: "/logout",
					method: "POST",
				},
				api,
				extraOptions,
			);
			localStorage.removeItem("token");
			localStorage.removeItem("auth-user");
			api.dispatch(logout());
			//toast.error("refresh token failure");
		}
	}

	return result;
};
