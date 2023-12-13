import prisma from "@/app/prismadb"
import { NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { randomUUID } from "crypto"
import { z } from "zod"
import { SignUpSchema } from "@/ZodSchema/UserSchema"
import nodemailer from "nodemailer"

const ForgetPasswordSchema = z.object({
    email: z.string().email().refine(value => !!value, {
        message: "Email is mandatory and should be a valid email address",
    })
})

export async function POST(request: Request) {
    const body = await request.json()
    const {email} = body
    if(ForgetPasswordSchema.safeParse(body).success === false){
        return NextResponse.error()
    }

    const userExist = await prisma.user.findUnique({
        where:{
            email
        }
    })
    
    if(!userExist){
        return NextResponse.json({ErrorMessage: "User not found"})
    }
    
    var transport = nodemailer.createTransport({
        service: 'gmail',
        auth:{
            user:process.env.USER_MAIL,
            pass:process.env.USER_PASSWORD
        }
    })

    try {
        const forgetPasswordToken = await prisma.user.update({
            where:{
                email
            },
            data:{
                forgetpasswordtoken: `${randomUUID()}${randomUUID()}`.replace(/-/g, ''),
            }
        })

        const options = {
            from: process.env.USER_MAIL,
            to: userExist.email as string,
            subject:"Password change request",
            html:`<a href="${process.env.NEXT_URL}/passwordchange/${forgetPasswordToken.forgetpasswordtoken}">Click here to change your password</a>`
        }
        
        transport.verify(function (error, success) {
            if(error){
                console.log(error)
            } else{
                console.log("Server is good to send email")
            }
        })

        await transport.sendMail(options)

        return NextResponse.json("Successfully send the password change email to user")
    } catch (error) {
        return NextResponse.error()
    }
}   


export async function PATCH (request: Request){
    const { token , newpassword } = await request.json()

    try {
        const userExist = await prisma.user.findFirst({
            where:{
                forgetpasswordtoken:token
            }
        })

        if(!userExist){
            return NextResponse.error()
        }
        
        const hashednewpassword = await bcrypt.hash(newpassword, 10)

        const changedpassword = await prisma.user.update({
            where:{
                id:userExist.id
            },
            data:{
                password:hashednewpassword,
                forgetpasswordtoken:null
            }
        })



        return NextResponse.json(changedpassword, {status: 200})
    } catch (error) {
        console.log(error)
        return NextResponse.json("Error while changing password", {status:500})
    }
}
