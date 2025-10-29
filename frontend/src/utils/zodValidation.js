import * as z from "zod"
import {any} from "zod";


// Register Schema
const registerSchema = z.object({

    name: z.string().min(2, "Name must be at least 2 characters long."),

    email: z.string().email("Invalid email address."),

    password: z.string().min(8, "Password must be at least 8 characters long.").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must include uppercase, lowercase, number, and special character."
    ),

    confirmPassword: z.string()

}).refine((data)=>data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"]
})




// Login Schema
const loginSchema = z.object({

    email: z.string().email("Invalid email address."),

    password: z.string().min(8, "Password must be at least 8 characters long.").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must include uppercase, lowercase, number, and special character."
    ),

})




// Forgot Password Email Submit Schema
const forgotPasswordEmailSubmitSchema = z.object({

    email: z.string().email("Invalid email address."),

})



// Reset Password Schema
const resetPasswordSchema = z.object({

    otp: z.string().min(6, "OTP must be exactly 6 digits.").max(6, "OTP must be exactly 6 digits.").regex(
        /^[0-9]+$/,
        "OTP must contain only numbers."
    ),

    password: z.string().min(8, "Password must be at least 8 characters long.").regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/,
        "Password must include uppercase, lowercase, number, and special character."
    ),

    confirmPassword: z.string()

}).refine((data)=>data.password === data.confirmPassword, {
    message: "Password do not match.",
    path: ["confirmPassword"]
})



// Update Profile Schema
const updateProfileSchema = z.object({

    name: z.string().min(2, "Name must be at least 2 characters long.")

})



// Add Todos Schema
const addTodoFormSchema = z.object({

    title: z.string().min(3, "Title must be at least 3 characters long."),

    description: z.string().max(200, "Description must not exceed 200 characters."),

    priority: z.enum(["low", "medium", "high"], {
        message: "Priority must be either low, medium, or high."
    }),

    status: z.enum(["pending", "completed"], {
        message: "Status must be either pending or completed.",
    }),

    dueDate: z.string().refine(
        (data)=>!isNaN(Date.parse(data)),
        {message: "Invalid date format."}
    ).refine((data)=>{
        const selectedDate = new Date(data)
        const currentDate = new Date()
        selectedDate.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        return selectedDate >= currentDate
    }, {message: "Due date cannot be in the past."}),

})



// Setting Schema
const settingSchema = z.object({

    siteName: z.string().trim().min(2, "Site name must be at least 2 characters long."),

    siteTitle: z.string().trim().optional(),

    siteLogo: z.any().optional().refine((file)=>{
        if(!file) return true;
        return ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file?.type)
    }, "Only image(png, jpeg, jpg, webp) files are allowed."),

    logoAltTag: z.string().trim().optional(),

    siteIcon: z.any().optional().refine((file)=>{
        if(!file) return true;
        return ["image/png", "image/jpeg", "image/jpg", "image/webp"].includes(file?.type)
    }, "Only image(png, jpeg, jpg, webp) files are allowed."),

    iconAltTag: z.string().trim().optional(),

})





export {
    registerSchema,
    loginSchema,
    forgotPasswordEmailSubmitSchema,
    resetPasswordSchema,
    updateProfileSchema,
    addTodoFormSchema,
    settingSchema,
}