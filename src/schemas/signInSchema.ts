import { z } from "zod";

export const signInSchema = z.object({
    identifier:z.string().min(2,{message:"Identifier must contain at least 2 characters"}),
    password:z.string().min(6,{message:"Password must contain at least 6 characters"})
})