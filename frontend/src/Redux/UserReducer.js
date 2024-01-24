import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: [],
};

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        addUsers: (state, { payload }) => {
            state.users = payload;
        },
    }
});

export const { addUsers } = userSlice.actions;
export const getAllUsers = (state) => state.users.users; // get a value from store name->property which is users
export default userSlice.reducer;