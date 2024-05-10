import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import {Message} from "@/model/user"
export   async function POST(request:Request){
    try {
        await dbConnect();
    const {username,content}=await request.json();
    const user=await UserModel.findOne({username}).exec();
    if(!user)
        {
            return Response.json({
                success:false,
                message:'user not exist'
            },{status:401})
        }
    if(!user.isAcceptingMessage)
        {
            return Response.json({
                success:false,
                message:'user is not accepting message'
            },{status:401})
        }
    const messageContent={content,createdAt:new Date()}
     user.messages.push(messageContent as Message)
     await user.save()
     return Response.json({
        success:true,
        message:'Message sent successfully'
     },{status:201})
    } catch (error) {
        console.log(error);
        return Response.json({
            success:false,
            message:"Internal server error"
        },{status:500})
        
    }
    
}