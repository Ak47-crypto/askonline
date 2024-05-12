import UserModel from "@/model/user";
import dbConnect from "@/lib/dbConnect";
import { isVerifyCodeExpire } from "@/helpers/isVerifyCodeExpire";
import bcrypt from 'bcrypt'
import { passwordChangeSchema } from "@/schemas/passwordChangeSchema";
import { z } from "zod";

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { username, code, password } = await request.json();
        const result = passwordChangeSchema.safeParse({ password, code, username })
        console.log(result);
        
        if (!result.success) {
            const Errors = result.error.format()._errors || []
            return Response.json({
                success: false,
                message: Errors.length > 0 ? Errors.join(',')
                    : 'invalid Inputs by User'
            }, { status: 400 })
        }
        const zodUsername = result.data.username

        const user = await UserModel.findOne({ username:zodUsername })
        if (!user) {
           return Response.json({
                success: false,
                message: "user not found"
            })
        } else {
            const isCodeTrue = user?.passwordCode === result.data.code;
            const isCodeNotExpired = isVerifyCodeExpire(user?.passwordCodeExpiry);
            if (isCodeTrue && isCodeNotExpired) {
                const hashedPassword = await bcrypt.hash(result.data.password, 10)
                user.password = hashedPassword;
                user.passwordCodeExpiry=Date.now()
                await user.save();
               return Response.json({
                    success: true,
                    message: "Password changed successfully"
                })
            }
            else if (!isCodeNotExpired) {
                return Response.json({
                    success: false,
                    message: "Code expired"
                })
            }
            else
                {
                   return Response.json({
                        success:false,
                        message:'Code is incorrect'
                    })
                }
        }
    } catch (error) {
       return Response.json({
            success: false,
            message: "Internal server error"
        })
    }
}