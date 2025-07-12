import { apiResponse } from '@/types/apiResponse';
import { promises } from 'dns';
import { Resend } from 'resend';
import VerificationEmail from '../../emails/verificationEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificatinEmail(
    email:string,
    username:string,
    verifyCode:string
):Promise<apiResponse>{
    try {
        // console.log(email,username,verifyCode)
         const res=await resend.emails.send({
            from: 'verification@askonline.space',
            to: email,
            subject: 'Your askonline verification code',
            react: VerificationEmail({username,otp:verifyCode})
          });
          console.log(res);
          
        return  {success:true,message:"email sent"}
    } catch (error) {
        console.log("error in sending email",error)
        return  {success:false,message:"error in sending email"}
    }
}
