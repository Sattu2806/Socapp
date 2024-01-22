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
        const {content, files,typePost,tags } = body

        const User = await prisma.user.findUnique({
            where:{
                email:Session.user.email
            }
        })

        console.log(files)

        if(!User){
            return NextResponse.json('No User were Found')
        }

        try {
            const NewPost = await prisma.post.create({
                data:{
                    content,
                    authorId:User.id,
                    tags,
                    type:typePost as TypePost,
                    Image:{
                        createMany:{
                            data: files && files
                            .filter((file:{filetype:string}) => file.filetype.startsWith("image"))
                            .map((file:{url:string, filetype:string, description:string}) => ({
                                url:file.url,
                                description:file.description
                            }))
                        }
                    },
                    Video:{
                        createMany:{
                            data: files && files
                            .filter((file:{filetype:string}) => file.filetype.startsWith("video"))
                            .map((file:{url:string, filetype:string, description:string}) => ({
                                url:file.url,
                                description:file.description
                            }))
                        }
                    },
                }
            })

            return NextResponse.json(NewPost, {status:201})
        } catch (error) {
            console.log(error)
            return NextResponse.error()
        }
        
    } catch (error) {
        console.log(error)
        return NextResponse.json('Could not Make a post', {status:400})
    }
}