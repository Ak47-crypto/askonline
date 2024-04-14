import { z } from "zod";

export const acceptMessageSchema=z.object({
    content:z
    .string()
    .min(10,{message:"content must be minimum of 10 character"})
    .max(300,{message:"content must be not more than 300 character"})

})