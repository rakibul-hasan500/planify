import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../../utils/getBaseUrl.js";
import {handleToggleAppLoading} from "../../app/appFunction/appSlice.js";

const userApi = createApi({
    reducerPath: "userApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/auth`,
        credentials: "include",
    }),
    tagTypes: ["user"],
    endpoints: (builder)=>({

        // Get All Users
        getAllUsers: builder.query({
            query: (data)=>({
                url: `/users?search=${data.search}&limit=${data.limit}&page=${data.page}`,
                method: "GET"
            }),
            providesTags: ["user"]
        }),


        // Delete User
        deleteUser: builder.mutation({
            query: (userId)=>({
                url: `/user/${userId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["user"],
            onQueryStarted(arg, {dispatch, queryFulfilled}){
                try{
                    // Loading Start
                    dispatch(handleToggleAppLoading(true))

                    // Complete Query
                    queryFulfilled()

                    // Loading Stop
                    dispatch(handleToggleAppLoading(false))
                }catch{
                    dispatch(handleToggleAppLoading(false))
                }
            }
        })



    })
})


export const {
    useGetAllUsersQuery,
    useDeleteUserMutation,
} = userApi;
export default userApi;