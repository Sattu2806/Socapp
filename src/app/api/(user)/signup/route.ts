import prisma from "@/app/prismadb"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import {z} from "zod"
import { SignUpSchema } from "@/ZodSchema/UserSchema"
import nodemailer from "nodemailer"

type SignupSchemaT = z.infer<typeof SignUpSchema>

export async function POST (request: Request){
    const body:SignupSchemaT = await request.json()
    console.log(SignUpSchema.safeParse(body))

    if(SignUpSchema.safeParse(body).success === false){
        return NextResponse.json("Data provided is not valid", {status:500})
    }

    const userExist = await prisma.user.findUnique({
        where:{
            email:body.email
        }
    })

    if(userExist){
        return NextResponse.json({
            errorMessage: "Email is associated with another account"
        })
    }
    
    const hashPassword = await bcrypt.hash(body.password, 10)

    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:process.env.USER_MAIL,
            pass:process.env.USER_PASSWORD
        }
    })
    
    try {
        const User = await prisma.user.create({
            data:{
                name:body.username,
                email:body.email,
                password:hashPassword
            }
        })
        
        const verificationtoken = await prisma.activateToken.create({
            data:{
                token: `${randomUUID()}${randomUUID()}`.replace(/-/g, '') ,
                userId:User.id
            }
        })

        const options = {
            from: process.env.USER_MAIL,
            to: User.email as string,
            subject:"Verify you email",
            html:`<a href="${process.env.NEXT_URL}/api/activate/${verificationtoken.token}">Click here to verify your email</a>`
        }
        
        transport.verify(function (error, success) {
            if(error){
                console.log(error)
            } else{
                console.log("Server is good to send email")
            }
        })

        await transport.sendMail(options)

        return NextResponse.json(User)
    } catch (error) {
        return NextResponse.json({errorMessage: "Error creating user", error})
    }

    
}