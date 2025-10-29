import {createSlice} from "@reduxjs/toolkit";

const todoSlice = createSlice({
    name: "todoSlice",
    initialState: {
        addTodoFormOpen: false,
        todoFormEditMode: false,

        selectedTodoForEdit: null,

        todoFormErrors: {
            titleError: "",
            descriptionError: "",
            priorityError: "",
            dueDateError: "",
            statusError: "",
        }
    },
    reducers: {
        // Handle Open Add TodoForm
        handleOpenAddTodoForm: (state)=>{
            state.selectedTodoForEdit = null;
            state.todoFormEditMode = false;
            state.addTodoFormOpen = true;
        },

        // Handle Close Add TodoForm
        handleCloseAddTodoForm: (state)=>{
            state.todoFormEditMode = false;
            state.addTodoFormOpen = false;
            state.selectedTodoForEdit = null;
        },

        // handle Open TodoForm Edit Mode
        handleOpenEditTodoForm: (state, action)=>{
            state.addTodoFormOpen = true;
            state.todoFormEditMode = true;
            state.selectedTodoForEdit = action.payload
        },

        // Get Todos Form Errors
        getTodoFormErrors: (state, action)=>{
            if(action.payload.field === "title"){
                state.todoFormErrors.titleError = action.payload.errorMessage;
            }else if(action.payload.field === "description"){
                state.todoFormErrors.descriptionError = action.payload.errorMessage;
            }else if(action.payload.field === "priority"){
                state.todoFormErrors.priorityError = action.payload.errorMessage;
            }else if(action.payload.field === "status"){
                state.todoFormErrors.statusError = action.payload.errorMessage;
            }else if(action.payload.field === "dueDate"){
                state.todoFormErrors.dueDateError = action.payload.errorMessage;
            }
        }

    }
})



export const {
    handleOpenAddTodoForm,
    handleCloseAddTodoForm,
    handleOpenEditTodoForm,
    getTodoFormErrors
} = todoSlice.actions;
const todoReducer = todoSlice.reducer;
export default todoReducer;