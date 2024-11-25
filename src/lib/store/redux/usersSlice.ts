import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	currentUser: {
		id: "",
		first_name_en: "",
		middle_name_en: "",
		last_name_en: "",
		first_name_am: "",
		middle_name_am: "",
		last_name_am: "",
		full_name_en: "",
		full_name_am: "",
		job_title: {
			id: "",
			title_en: "",
			title_am: "",
		},
		department: {
			id: "",
			department_name_en: "",
			department_name_am: "",
			abbreviation_en: "",
			abbreviation_am: "",
			description: "",
			contact_phone: 0,
			contact_email: "",
		},
		phone_number: 0,
		email: "",
		is_2fa_enabled: false,
		is_staff: false,
	},
};

const usersSlice = createSlice({
	name: "users",
	initialState,
	reducers: {
		SetCurrentUser: (state, action) => {
			state.currentUser = action.payload;
		},
		ClearCurrentUser: (state) => {
			state.currentUser = initialState.currentUser; // Resets to initial state
		},
	},
});

export const { SetCurrentUser, ClearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
