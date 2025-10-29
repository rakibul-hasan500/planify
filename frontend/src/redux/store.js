import {configureStore} from "@reduxjs/toolkit";
import authReducer from "./features/user-panel/auth/authSlice.js";
import authApi from "./features/user-panel/auth/authApi.js";
import appReducer from "./features/app/appFunction/appSlice.js";
import todoReducer from "./features/user-panel/todo/todoSlice.js";
import todoApi from "./features/user-panel/todo/todoApi.js";
import settingReducer from "./features/admin-panel/setting/settingSlice.js";
import settingApi from "./features/admin-panel/setting/settingApi.js";
import userApi from "./features/admin-panel/user/userApi.js";

const store = configureStore({
    reducer: {
        // App
        appFeature: appReducer,

        // Auth
        authFeature: authReducer,
        [authApi.reducerPath]: authApi.reducer,

        // Todos
        todoFeature: todoReducer,
        [todoApi.reducerPath]: todoApi.reducer,

        // Setting
        settingFeature: settingReducer,
        [settingApi.reducerPath]: settingApi.reducer,

        // User
        [userApi.reducerPath]: userApi.reducer,
    },


    middleware: (getDefaultMiddleware)=>getDefaultMiddleware()
        .concat(authApi.middleware)
        .concat(todoApi.middleware)
        .concat(settingApi.middleware)
        .concat(userApi.middleware)



})


export default store;