import mongoose, { Schema, Document } from "mongoose";


export interface Message extends Document {
    content: string;
    createdAt: Date;
  }
  
  const MessageSchema: Schema<Message> = new Schema({
    content: {
      type: String,
      require: true,
    },
    createdAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  });


export interface User extends Document {
  name: string;
  email: string;
  username: string;
  password: string;
  isVerifyied:boolean;
  verifyCode:string;
  verifyCodeExpiry:number
  isAcceptingMessage:boolean
  messages:Message[]
}

const UserSchema: Schema<User> = new Schema({
  name: {
    type: String,
    require: [true, "name is required"],
  },
  email: {
    type: String,
    require: [true, "email is required"],
  },
  username: {
    type: String,
    require: [true, "username is required"],
    trim: true,
  },
  password: {
    type: String,
    require: [true, "password is required"],
  },
  isVerifyied:{
    type:Boolean,
    default:false
  },
  isAcceptingMessage: {
    type: Boolean,
    default:true
  },
  verifyCode: {
    type: String,
    require: [true, "verify code is required"],
  },
  verifyCodeExpiry: {
    type: Number,
    require: [true, "verify code expiry is required"],
  },
  messages: [MessageSchema]
});

 const UserModel = (mongoose.models.User as mongoose.Model<User>)|| (mongoose.model<User>("User",UserSchema))

 export default UserModel;
