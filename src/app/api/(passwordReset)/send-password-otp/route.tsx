import React from 'react'
import UserModel from '@/model/user';
import dbConnect from '@/lib/dbConnect';
import { generateOTP } from '@/helpers/otpGenerator';
import { sendPasswordEmail } from '@/helpers/sendPasswordEmail';
export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email } = await request.json();
    const user = await UserModel.findOne({ email, isVerified: true })
    if (!user) {
      return Response.json({
        success: false,
        message: "user not found"
      }, { status: 401 })
    }
    if (user) {
      
      const code = generateOTP(6);
      
      const emailResponse = await sendPasswordEmail(
        email,
        user.username,
        code
      );
      if (!emailResponse.success) {
        return Response.json(
          {
            success: false,
            message: emailResponse.message,
          },
          { status: 500 }
        );
      }
      user.passwordCode = code;
      user.passwordCodeExpiry = Date.now() + 6 * 60 * 60 * 1000;
      await user.save();
      return Response.json(
        {
          success: true,
          message: 'Password code Send to email',
          username:user.username
        },
        { status: 201 }
      );
    }
  } catch (error) {
    console.log(error)
    return Response.json(
      {
        success: false,
        message: 'Internal server error',
      },
      { status: 500 }
    );
  }
}
