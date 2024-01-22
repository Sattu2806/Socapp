'use client'
import React, { useEffect, useState } from 'react'
import { Image as ImageType, Video as VideoType, Post, TypePost, Like } from '@prisma/client'
import axios from 'axios'
import {useInfiniteQuery} from "@tanstack/react-query"
import {useInView} from "react-intersection-observer"
import { Card } from '../ui/card'
import Image from 'next/image'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../ui/carousel'
import { Separator } from '../ui/separator'
import PostSkeleton from './PostSkeleton'
import UserEngagement from './UserEngagement'
import Comment_Section from './Comment_Section'

type Props = {}

type PostQueryParams = {
    take?:number
    lastCursor?:string
    typePost: TypePost
}

export interface PostData extends Post{
    Image: ImageType[]
    Video:VideoType[]
    author:{
        name:string,
        image:string
    },
    like:Like[],
    Comment:{
        id:string
    }[]
}

const PostRender = (props: Props) => {
    const {ref,inView} = useInView()
    const AllPost = async ({take,lastCursor,typePost}: PostQueryParams) => {
        const response = await axios.get('/api/getPost', {
            params:{
                take,
                lastCursor,
                typePost
            }
        })
        return response?.data
    }

    const {
        data,
        error,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isSuccess,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryFn: ({pageParam = ""}) => AllPost({take:5, lastCursor:pageParam, typePost:TypePost.POST}),
        queryKey:["posts"],
        getNextPageParam: (lastPage) => {
            return lastPage?.metaData.lastCursor
        },
        initialPageParam:undefined
    })

    console.log(data)
    
    useEffect(() => {
        if(inView && hasNextPage){
            fetchNextPage()
        }
    }, [hasNextPage,inView,fetchNextPage])

    if(error as any){
        return (
            <div className='mt-10'>
                Unable to Fetch Post
            </div>
        )
    }

    if(isLoading){
        return(
            <PostSkeleton/>
        )
    }

    // console.log(data)
  return (
    <div className='mt-8'>
        {data?.pages.map((page) => 
            page.data.map((post: PostData, index: number) => {
                if(page.data.length === index + 1){
                    return(
                        <div key={index} ref={ref}>
                            <PostRenderData data={post}/>
                        </div>
                    )
                }else{
                    return(
                        <div>
                            <PostRenderData data={post}/>
                        </div>
                    )
                }
            })
        )}
    </div>
  )
}

export default PostRender


const PostRenderData = ({data}:{data:PostData}) => {
    const [getComments, setGetComments] = useState<boolean>(false)
    return (
        <Card className='p-4 my-6'>
            <div className='flex items-center space-x-4'>
                <Image src={data.author.image ? data.author.image : "/image4.jpg"} width={40} height={40} alt='Image' className='rounded-full h-[40px] object-cover object-top' />
                <div className='text-sm'>
                    <p>{data.author.name}</p>
                </div>
            </div>
            {(data.Image.length >0 || data.Video.length > 0) && 
            <div className='mt-2'>
            <Carousel className='w-full h-full'>
                <CarouselContent>
                    {data?.Image.map((image,index) => (
                        <CarouselItem key={index} className='relative'>
                            <img src={image.url} className='rounded-md overflow-hidden relative' alt="" />
                        </CarouselItem>
                    ))}
                    {data?.Video.map((video,index) => (
                        <CarouselItem key={index} className='relative'>
                            <video src={video.url} className='rounded-md overflow-hidden relative' autoPlay controls />
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselNext className='right-0'/>
                <CarouselPrevious className='left-0'/>
            </Carousel>
            </div>
            }
            <div className='p-4 my-2'>
                {data.content && (
                    <p className='prose prose-sm sm:prose focus:outline-none prose-p:loading-0 prose-a:text-red-400 xl:prose-base dark:prose-code:text-white dark:prose-p:text-white dark:prose-h1:text-white dark:prose-h2:text-white dark:prose-h3:text-white dark:prose-strong:text-white dark:prose-italic:text-white ' dangerouslySetInnerHTML={{__html:data.content}}></p>
                )}
            </div>
            <div className='mt-5 grid grid-cols-2 gap-10'>
                <div className='relative'>
                    <Image src='/image4.jpg' width={40} height={40} alt='Image' className='rounded-full h-[40px] object-cover object-top'/>
                    <Image src='/image4.jpg' width={40} height={40} alt='Image' className='rounded-full h-[40px] object-cover object-top absolute left-[25px] top-0 shadow shadow-gray-200'/>
                    <Image src='/image4.jpg' width={40} height={40} alt='Image' className='rounded-full h-[40px] object-cover object-top absolute left-[45px] top-0 shadow shadow-gray-200'/>
                </div>
                <div className='flex items-center justify-around'>
                    <p onClick={() => setGetComments(!getComments)} className='text-sm opacity-50 cursor-pointer'>{data.Comment.length} comments</p>
                    <p className='text-sm opacity-50'>{data.like.length} Likes</p>
                </div>
            </div>
            <Separator className='my-4' />
            <UserEngagement post={data} />
            {getComments && (
                <>
                    <Separator className='my-4' />
                    <Comment_Section postId={data.id} getComments={getComments} setGetComments={setGetComments} />
                </>
            )}
        </Card>
    )
}