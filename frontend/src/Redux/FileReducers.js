import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    files: [],
};

const fileSlice = createSlice({
    name: "files",
    initialState,
    reducers: {
        addfiles: (state, { payload }) => {
            state.files = payload;
        },
    }
});

export const { addfiles } = fileSlice.actions;
export const getAllFiles = (state) => state.files.files;
export default fileSlice.reducer;