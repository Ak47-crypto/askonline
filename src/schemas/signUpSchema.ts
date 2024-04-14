import { z } from "zod";

export const userNameSchema = z
    .string()
    .min(2,{message:"username should be minimum of 2 characters long"})
    .max(10,{message:"username should no be more than 10 characters"})
    .regex(/^[a-zA-Z0-9_]+$/,{message:"username must not contain special characters"})

export const signUpSchema = z.object({
    username:userNameSchema,
    email:z.string().email({message:"Invalid email address"}),
    password:z.string().min(6,{message:"password must be at least 6 characters long"}).max(12,{message:"password should not be more than 12 characters long"})
})