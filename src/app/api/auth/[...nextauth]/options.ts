import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";
import bcrypt from "bcrypt";
export const auth0options: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "Credentioals",
      name: "Credentials",

      credentials: {
        email: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error("user not found");
          }
          if (!user.isVerifyied) {
            throw new Error("user not verified");
          }
          const isPasswordCorrect = bcrypt.compare(
            credentials.password,
            user.password
          );
          if (!isPasswordCorrect) {
            throw new Error("credentials are incorrect");
          }
          return user;
        } catch (err: any) {
          throw new Error("error occured", err);
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
        if(user){
      token._id = user._id?.toString();
      token.isVerified = user.isVerified;
      token.isAcceptingMessage = user.isAcceptingMessage;
      token.username=user.usernmae;
        }
      return token;
    },
    async session({ session, user, token }) {
        if(token){
            session.user._id=token._id;
            session.user._isVerified=token._isVerified;
            session.user._isAcceptingMessage=token._isAcceptingMessage;
            session.user.username=token.username
        }
      return session;
    },
  },
  pages: {
    signIn: "/sign-in",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
