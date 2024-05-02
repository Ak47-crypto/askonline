import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { userNameSchema } from "@/schemas/signUpSchema";

const UsernameQuerySchema=z.object({
    username:userNameSchema
})

export async function GET(request:Request) {
    await dbConnect();
    
    try {
        const {searchParams} = new URL(request.url) 
        const queryParams={
            username:searchParams.get('username')
        }
        const result=UsernameQuerySchema.safeParse(queryParams)
        if (!result.success) {
            const usernameErrors=result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:usernameErrors.length>0?usernameErrors.join(',')
                :'invalid query parameters'
            },{status:400})
        }
        const {username}=result.data
        const user = await UserModel.findOne({username,isVerified:true})
        
        
        if (user) {
            return Response.json({
                success:false,
                message:'username already taken'
            },{status:400})
        }
        return Response.json({
            success:true,
            message:'username is unique'
        })
    } catch (error) {
        return Response.json({
            success:false,
            message:'error checking username'
        },{status:500})
    }
}