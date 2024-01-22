import prisma from "@/app/prismadb"
import { getServerSession } from "next-auth"
import { NextResponse, NextRequest } from "next/server"
import { options } from "../../auth/[...nextauth]/options"

export async function GET(request: NextRequest){
    const searchParams = new URLSearchParams(request.url.split('?')[1])
    const parentCommentId = searchParams.get('parentCommentId')
    const Session = await getServerSession(options)
    
    if(!Session){
        return NextResponse.json('unAuthorized User ...')
    }
    
    if(!Session?.user?.email){
        return 
    }

    if(!parentCommentId){
        return NextResponse.json('No parentCommentId provided')
    }

    try {
        const ReplyComments = await prisma.comment.findMany({
            where:{
                parentCommentId
            },
            include:{
                replies:true,
                author:{
                    select:{
                        name:true,
                        image:true
                    }
                },
                like:{
                    where:{
                        userId:Session.user.id
                    }
                }
            }
        })
        return NextResponse.json(ReplyComments)
    } catch (error) {
        console.log('Error fetching comment data', error)
        return NextResponse.error()
    }
}