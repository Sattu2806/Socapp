import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google"
import CredentialProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/app/prismadb"
import bcrypt from "bcrypt"
import axios from "axios";


export const options:NextAuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers:[
        GoogleProvider({
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialProvider({
            name:"credentials",
            credentials:{
                email: {},
                password: {},
            },
            async authorize(credentials, req) {
                if (!credentials?.email || !credentials?.password) {
                  return null;
                }

                console.log(credentials.email)
              
                const user = await prisma.user.findUnique({
                  where: {
                    email: credentials.email,
                  },
                });
              
                if (!user) {
                  return null;
                }
                
              
                const passwordMatch = await bcrypt.compare(credentials.password, user.password!);
                
                if(!passwordMatch || !user.verified_user){
                    return null
                }

                return user
            },
              
        })
    ],
    pages:{
        signIn: '/signin'
    },
    callbacks:{
        async jwt({token,user,session}){
            if(user){
                return {
                    ...token,
                    id: user.id
                }
            }
            return token
        },
        async session({session,user,token}){
                return {
                    ...session,
                    user:{
                        ...session.user,
                        id:token.id
                    }
                }
        },
    },
    session:{
        strategy:"jwt",
    },
    secret:process.env.NEXTAUTH_SECRET,
    debug:process.env.NODE_ENV === "development"
}