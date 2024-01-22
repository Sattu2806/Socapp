import prisma from "@/app/prismadb"
import { NextResponse, NextRequest } from "next/server"
import { getServerSession } from "next-auth"
import {options} from "@/app/api/auth/[...nextauth]/options"
import { TypePost } from "@prisma/client"

export async function GET(request: NextRequest){
    const Session = await getServerSession(options)

    if(!Session) return NextResponse.json('User must be logged in')

    const searchParams = new URLSearchParams(request.url.split('?')[1])
    const typePost = searchParams.get('typePost')
    const take = searchParams.get('take')
    const lastCursor = searchParams.get('lastCursor')

    try {
        const Post = await prisma.post.findMany({
            where:{
                type:typePost as TypePost
            },
            include:{
                Video:true,
                Image:true,
                author:{
                    select:{
                        name:true,
                        image:true
                    }
                },
                like:true,
                Comment:{
                    select:{
                        id:true
                    }
                }
            },
            take: take ? parseInt(take as string) : 10,
            ...(lastCursor && {
                skip:1,
                cursor:{
                    id:lastCursor as string
                }
            }),
            orderBy:{
                createdAt:'desc'
            }
        })

        if(Post.length == 0){
            return new Response(JSON.stringify({
                data:[],
                metaData:{
                    lastCursor:null,
                    hasNextPage: false
                }
            }), {status:200})
        }
        
        const lastPointInResults : any = Post[Post.length - 1]
        const cursor: any = lastPointInResults.id

        const nextPage = await prisma.post.findMany({
            take: take ? parseInt(take as string) : 10,
            skip:1,
            cursor:{
                id:cursor
            }
        })

        const data = {
            data:Post,
            metaData:{
                lastCursor:cursor,
                hasNextPage: nextPage.length > 0
            }
        }

        return NextResponse.json(data)
        
    } catch (error) {
        console.log(error,"Error fetching post data")
        return NextResponse.error()
    }
}