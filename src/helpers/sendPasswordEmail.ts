import { apiResponse } from '@/types/apiResponse';
import { promises } from 'dns';
import { Resend } from 'resend';
import VerificationEmail from '../../emails/verificationEmail';
import PasswordResetEmail from '../../emails/PasswordResetEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendPasswordEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<apiResponse>{
    try {
        // console.log(email,username,verifyCode)
         const res=await resend.emails.send({
            from: 'verification@askonline.fun',
            to: email,
            subject: 'Your askonline password reset code',
            react: PasswordResetEmail({username,otp:verifyCode})
          });
          console.log(res);
          
        return  {success:true,message:"email sent"}
    } catch (error) {
        console.log("error in sending email",error)
        return  {success:false,message:"error in sending email"}
    }
}