import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    images: [],
};

const imageSlice = createSlice({
    name: "images",
    initialState,
    reducers: {
        addImages: (state, { payload }) => {
            state.images = payload;
        },
    }
});

export const { addImages } = imageSlice.actions;
export const getAllImages = (state) => state.images.images;
export default imageSlice.reducer;