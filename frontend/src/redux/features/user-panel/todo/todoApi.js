import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import getBaseUrl from "../../../../utils/getBaseUrl.js";
import {handleToggleAppLoading} from "../../app/appFunction/appSlice.js";

const todoApi = createApi({
    reducerPath: "todoApi",
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/todo`,
        credentials: "include"
    }),
    tagTypes: ["todo"],
    endpoints: (builder)=>({

        // Create Todos
        createTodo: builder.mutation({
            query: (todoData)=>({
                url: "/create",
                method: "POST",
                body: todoData
            }),
            invalidatesTags: ["todo"],
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

        // Get Todos
        getTodos: builder.query({
            query: ({status="", page=1, limit=10})=>({
                url: `/todos?status=${status}&page=${page}&limit=${limit}`,
                method: "GET"
            }),
            providesTags: ["todo"]
        }),

        // Delete Todos
        deleteTodo: builder.mutation({
            query: (todoId)=>({
                url: `/delete/${todoId}`,
                method: "DELETE"
            }),
            invalidatesTags: ["todo"],
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

        // Update Todos
        updateTodo: builder.mutation({
            query: (todoData)=>({
                url: "/update",
                method: "PUT",
                body: todoData
            }),
            invalidatesTags: ["todo"],
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

        // Update Todos Status
        updateTodoStatus: builder.mutation({
            query: (todoId)=>({
                url: `/update/${todoId}`,
                method: "PATCH",
            }),
            invalidatesTags: ["todo"],
            async onQueryStarted(arg, {dispatch, queryFulfilled}){
                try{
                    // Loading
                    dispatch(handleToggleAppLoading(true));

                    // Completed
                    await queryFulfilled()

                    // Loading Stop
                    dispatch(handleToggleAppLoading(false));
                }catch{
                    dispatch(handleToggleAppLoading(false))
                }
            }
        })

    })
})



export const {
    useCreateTodoMutation,
    useGetTodosQuery,
    useDeleteTodoMutation,
    useUpdateTodoMutation,
    useUpdateTodoStatusMutation,
} = todoApi;
export default todoApi;