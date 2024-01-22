import prisma from "@/app/prismadb"
import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest){
    const searchParams = new URLSearchParams(request.url.split('?')[1])
    const postId = searchParams.get('postId')

    if(!postId){
        return NextResponse.json('No postId provided')
    }

    try {
        const Comments = await prisma.comment.findMany({
            where:{
                parentCommentId:null,
                postId
            },
            include:{
                replies:true,
                author:{
                    select:{
                        name:true,
                        image:true
                    }
                },
                like:true
            }
        })

        return NextResponse.json(Comments)
    } catch (error) {
        console.log('Error fetching comment data', error)
        return NextResponse.error()
    }
}