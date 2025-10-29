import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../../utils/getBaseUrl.js";
import {handleToggleAppLoading} from "../../app/appFunction/appSlice.js";

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/auth`,
        credentials: "include"
    }),
    tagTypes: ["auth"],
    endpoints: (builder)=>({

        // Register User
        registerUser: builder.mutation({
            query: (userData)=>({
                url: "/signup",
                method: "POST",
                body: userData
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // Verify Account
        verifyAccount: builder.mutation({
            query: (otp)=>({
                url: "/verify-account",
                method: "POST",
                body: otp
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // Resend OTP
        resendOtp: builder.mutation({
            query: ()=>({
                url: "/resend-otp",
                method: "POST",
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // OTP Expire Time
        getOtpExpireTime: builder.query({
            query: ()=>({
                url: "/otp-expire-time",
                method: "GET",
            }),
            providesTags: ["auth"]
        }),

        // Login User
        loginUser: builder.mutation({
            query: (userData)=>({
                url: "/login",
                method: "POST",
                body: userData
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // Login With Google
        LoginWithGoogle: builder.mutation({
           query: (userData)=>({
               url: "/google",
               method: "POST",
               body: userData
           }),
           providesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // Forgot Password Email Submit
        forgotPasswordEmailSubmit: builder.mutation({
            query: (userData)=>({
                url: "/forgot-password-email-submit",
                method: "POST",
                body: userData
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // Reset Password
        resetPassword: builder.mutation({
            query: (userData)=>({
                url: "/reset-password",
                method: "POST",
                body: userData
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // Log Out User
        logOutUser: builder.mutation({
            query: ()=>({
                url: "/logout",
                method: "POST",
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // Update User Profile
        updateProfile: builder.mutation({
            query: (userData)=>({
                url: "/update-profile",
                method: "PUT",
                body: userData
            }),
            invalidatesTags: ["auth"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try {
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled;

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                } catch {
                    dispatch(handleToggleAppLoading(false));
                }
            },
        }),

        // User Profile Data
        getUserData: builder.query({
            query: ()=>({
                url: "/me",
                method: "GET",
            }),
            providesTags: ["auth"]
        })

    })
})




export const {
    useRegisterUserMutation,
    useVerifyAccountMutation,
    useResendOtpMutation,
    useGetOtpExpireTimeQuery,
    useLoginUserMutation,
    useLoginWithGoogleMutation,
    useForgotPasswordEmailSubmitMutation,
    useResetPasswordMutation,
    useLogOutUserMutation,
    useUpdateProfileMutation,
    useGetUserDataQuery,
} = authApi;
export default authApi;