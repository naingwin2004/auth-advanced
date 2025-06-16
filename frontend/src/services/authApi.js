import { createApi } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReauth } from "./baseQuerWithReauth.js";

export const authApi = createApi({
	reducerPath: "authApi",
	baseQuery: baseQueryWithReauth,
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

		forgotPassword: builder.mutation({
			query: (email) => ({
				url: "/forgotPassword",
				method: "POST",
				body: email,
			}),
		}),

		resetPassword: builder.mutation({
			query: ({token, data}) => ({
				url: `/resetPassword/${token}`,
				method: "POST",
				body: data,
			}),
		}),

		logout: builder.mutation({
			query: () => ({
				url: "/logout",
				method: "POST",
			}),
		}),

		checkAuth: builder.query({
			query: () => "/checkAuth",
		}),
	}),
});

export const {
	useLoginMutation,
	useLogoutMutation,
	useRegisterMutation,
	useVerifyEmailMutation,
	useForgotPasswordMutation,
	useResetPasswordMutation,
	useResendVerificationTokenMutation,
	useCheckAuthQuery,
} = authApi;
