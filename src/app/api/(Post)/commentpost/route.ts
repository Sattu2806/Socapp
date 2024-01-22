import prisma from "@/app/prismadb"
import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options"
import { TypePost } from "@prisma/client"


export async function POST(request: NextRequest){
    const Session = await getServerSession(options)
    
    if(!Session){
        return NextResponse.json('unAuthorized User ...')
    }
    
    if(!Session?.user?.email){
        return 
    }

    try {
        const body = await request.json()
        const {PostId, Content } = body

        if(!PostId || !Content){
            return NextResponse.json("Provide Data")
        }

        const User = await prisma.user.findUnique({
            where:{
                email:Session.user.email
            }
        })

        if(!User){
            return NextResponse.json('No User were Found')
        }


        const existingPost = await prisma.post.findUnique({
            where:{
                id:PostId
            }
        })

        if(!existingPost){
            return NextResponse.json('No post found with provided postId')
        }
        
        const newComment = await prisma.comment.create({
            data:{
                authorId:User.id,
                postId:PostId,
                content:Content
            }
        })

        return NextResponse.json(newComment)
    } catch (error) {
        console.log("Error creating comment", error)
        return NextResponse.error()
    }

}