import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../../utils/getBaseUrl.js";
import {handleToggleAppLoading} from "../../app/appFunction/appSlice.js";

const settingApi = createApi({
    reducerPath: "settingApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/setting`,
        credentials: "include"
    }),
    tagTypes: ["setting"],
    endpoints: (builder)=>({

        // Update Setting
        updateSetting: builder.mutation({
            query: (formData)=>({
                url: "/update",
                method: "PUT",
                body: formData
            }),
            invalidatesTags: ["setting"],
            onQueryStarted(arg, {dispatch, queryFulfilled}) {
                try{
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Complete Query
                    queryFulfilled()

                    // Stop Loading
                    dispatch(handleToggleAppLoading(false));
                }catch{
                    dispatch(handleToggleAppLoading(false));
                }
            }
        }),

        // Get App Data
        getAppData: builder.query({
            query: ()=>({
                url: "/data",
                method: "GET"
            }),
            providesTags: ["setting"],
        })



    })
})


export const {
    useUpdateSettingMutation,
    useGetAppDataQuery,
} = settingApi;
export default settingApi;