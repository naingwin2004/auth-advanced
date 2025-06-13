import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
	name: "auth",
	initialState: {
		token: localStorage.getItem("token") || null,
		user: JSON.parse(localStorage.getItem("auth-user")) || null,
	},
	reducers: {
		setCredentials: (state, action) => {
			const { token, user } = action.payload;
			state.token = token;
			state.user = user;
		},
		logout: (state) => {
			state.token = null;
			state.user = null;
		},
		updateUser: (state, action) => {
			state.user = {
				...state.user,
				...action.payload,
			};
		},
	},
});

export const { setCredentials, logout,updateUser } = authSlice.actions;

export default authSlice.reducer;
