import dbConnect from "@/lib/dbConnect";
import UserModel, { User } from "@/model/user";
import { sendVerificatinEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcrypt";
import { generateOTP } from "@/helpers/otpGenerator";
import { isVerifyCodeExpire } from "@/helpers/isVerifyCodeExpire";

interface UserFace {
  name: string;
  username: string;
  email: string;
  password: string;
  verifyCode: string;
  verifyCodeExpiry: number;
}

export async function POST(request: Request) {
  await dbConnect();
  try {
    const { name, username, email, password } = await request.json();
    const isUserExist = await UserModel.findOne({ username });
    // user exist
    try {
      if (isUserExist) {
        console.log(isUserExist);
        // user exist and not verified
        if (!isUserExist.isVerifyied) {
          if (isVerifyCodeExpire(isUserExist.verifyCodeExpiry)) {
            const code = generateOTP(6);
            isUserExist.verifyCode = code;
            await isUserExist.save();
            await sendVerificatinEmail(
              isUserExist.email,
              isUserExist.username,
              code
            );
            return Response.json({
              success: true,
              code: 12,
              message: "re-verify please code re-generated",
            });
          } else {
            await sendVerificatinEmail(
              isUserExist.email,
              isUserExist.username,
              isUserExist.verifyCode
            );
            return Response.json({
              success: true,
              code: 12,
              message: "re-verify please",
            });
          }
        } else {
          return Response.json({
            success: false,
            message: "user already exist",
          });
        }
      }
    } catch (error) {
      return Response.json({
        success: false,
        message: "some error occured",
      });
    }
    // user does not exist
    const hashPassword = await bcrypt.hash(password, 10);
    const verifyCode = generateOTP(6);
    const sixHoursLaterUnixTimestamp = Date.now() + 6 * 60 * 60 * 1000;
    const res = await sendVerificatinEmail(email, username, verifyCode);
    const user = await UserModel.create({
      name,
      username,
      email,
      password: hashPassword,
      verifyCode: verifyCode,
      verifyCodeExpiry: sixHoursLaterUnixTimestamp,
    } as UserFace);
    const data = await UserModel.findById(user._id).select(
      "-password -verifyCode"
    );

    // console.log(
    //   verifyCode,
    //   username,
    //   email,
    //   password,
    //   hashPassword,
    //   sixHoursLaterUnixTimestamp
    // );
    return Response.json({
      success: true,
      message: "user created successfully",
      data: data,
    });
  } catch (error) {
    console.log(error);
    return Response.json({
      success: false,
      message: "Error in sign up",
    });
  }
}
