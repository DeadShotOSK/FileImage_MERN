import { configureStore } from '@reduxjs/toolkit';
import UserReducer from './UserReducer';
import ImageReducers from './ImageReducers';
import FileReducers from './FileReducers';

export const store = configureStore({
    reducer: {
        users: UserReducer,
        images: ImageReducers,
        files: FileReducers
    }
});