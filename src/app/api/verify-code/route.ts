import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import { z } from "zod";
import { verifyCodeSchema } from "@/schemas/verifyCodeSchema";
import { isVerifyCodeExpire } from "@/helpers/isVerifyCodeExpire";


export async function POST(request: Request) {
  await dbConnect();
  try {
    const { username, code } = await request.json();
    
    const result = verifyCodeSchema.safeParse({code});
    if (!result.success) {
      const schmaErrors=result.error.format().code?._errors || []
      
      
      return Response.json(
        {
          success: false,
          message: schmaErrors.length>0?schmaErrors.join(','): "code format is wrong",
        },
        { status: 400 }
      );
    }
    const user = await UserModel.findOne({username});
    const isCodeTrue = user?.verifyCode === result?.data?.code;
    const isCodeNotExpired = isVerifyCodeExpire(user?.verifyCodeExpiry);
    if(!user){
      return Response.json({
        success:false,
        message:'User not found'
      })
    }

    if(user?.isVerified==true)
      {
        return Response.json({
          success:true,
          message:'User already Verified'
        })
      }
    if (isCodeTrue && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
      return Response.json(
        {
          success: true,
          message: "user verified successfully",
        },
        { status: 200 }
      );
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message: "code expired please sign up again",
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: "code is incorrect",
        },
        { status: 400 }
      );
    }
  } catch (err) {
    console.log(err);
    
    return Response.json(
      {
        success: false,
        message: "internal Error occured",
      },
      { status: 500 }
    );
  }
}
