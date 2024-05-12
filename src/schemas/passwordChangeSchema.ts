import { z } from "zod";

export const passwordChangeSchema=z.object({
    password:z.string().min(6,{message:"password must be at least 6 characters long"}),
    code:z.string().min(6,{message:"Code must be 6 characters long"}),
    username:z?.string()
})