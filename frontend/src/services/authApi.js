import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_SERVER_URL}`,
		credentials: "include",
		prepareHeaders: (headers, { getState }) => {
			const token = getState().auth.token;
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		login: builder.mutation({
			query: (data) => ({
				url: "/login",
				method: "POST",
				body: data,
			}),
		}),
		register: builder.mutation({
			query: (data) => ({
				url: "/register",
				method: "POST",
				body: data,
			}),
		}),
		verifyEmail: builder.mutation({
			query: (data) => ({
				url: "/verifyEmail",
				method: "POST",
				body: data,
			}),
		}),
		resendVerificationToken: builder.mutation({
			query: (email) => ({
				url: "/resendVerificationToken",
				method: "POST",
				body: email,
			}),
		}),
		checkAuth: builder.query({
			query: () => "/checkAuth",
		}),
		logout: builder.mutation({
			query: () => ({
				url: "/logout",
				method: "POST",
			}),
		}),
	}),
});

export const {
	useLoginMutation,
	useRegisterMutation,
	useVerifyEmailMutation,
	useLogoutMutation,
	useResendVerificationTokenMutation,
	useCheckAuthQuery,
} = authApi;
