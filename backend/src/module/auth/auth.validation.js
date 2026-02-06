
import { z } from 'zod'

// signup validation

export const signUpSchema = z.object({
    name: z
        .string()
        .min(2, "Name must be at least two characters long")
        .max(50, "Name is to long"),
    email: z
        .string()
        .email("Invalid email formet"),

    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

})

export const loginSchema = z.object({
    email: z
        .string()
        .email("Invalid email formet"),

    password: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

})


export const forgetPasswordSchema = z.object({
    email: z.string().email(),
});

export const resetPasswordSchema = z.object({
    token: z.string().min(10),
    newPassword: z.string()
        .min(6, "Password must be at least 6 characters")
        .max(20, "Password must not exceed 20 characters")
        .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
        .regex(/[a-z]/, "Password must contain at least one lowercase letter")
        .regex(/[0-9]/, "Password must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character")

});