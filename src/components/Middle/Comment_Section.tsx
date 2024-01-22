import { Comment, Like } from '@prisma/client'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Skeleton } from '../ui/skeleton'
import Image from 'next/image'
import { Heart, MessageSquare } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { FaHeart } from 'react-icons/fa'
import ReplyComment from './ReplyComment'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

type Props = {
    postId:string
    getComments:Boolean
    setGetComments: React.Dispatch<React.SetStateAction<boolean>>
}

interface ReplyComment extends Comment {
    replies: Comment[]
    author:{
        name:string
        image:string
    }
    like:Like[]
}

const Comment_Section = ({
    postId,
    getComments,
    setGetComments
}: Props) => {

    const {data: Session} = useSession()
    const [IsLoading, setIsLoading] = useState<boolean>(false)
    const [showReply, setShowReply] = useState <{[key:string] : boolean }>({})

    const toggleShowReply = (commentId:string) => {
        setShowReply((prev) => ({...prev, [commentId] : !prev[commentId]}))
    }

    const {
        data: CommentData = [],
        isLoading,
        isError,
        refetch,
        isFetching
    } 
     = useQuery<ReplyComment[]>({
        queryKey:['AllComments', postId],
        queryFn: () => axios.get('/api/get-comments', {
            params:{
                postId
            }
        }).then((res) => res.data),
        staleTime:1000 * 60, // 1 minute,
        retry:3,
        enabled:false
     })

     useEffect(() => {
        if(getComments === true && postId){
            refetch()
        }
     }, [getComments, postId])

     console.log("CommentData", CommentData)

     const [likeStatus_1, setLikeStatus] = useState<{[commentId: string] : boolean}>(
        CommentData.reduce((acc,comment) => {
            const isLiked = comment.like?.some((li) => li.userId === Session?.user.id)
            acc[comment.id] = isLiked
            return acc
        }, {} as {[commentId: string]: boolean})
     )

     const LikeComment = async (postId: string, commentId: string) => {
        setIsLoading(true)
        const updatedLikeStatus = ({...likeStatus_1, [commentId]: !likeStatus_1[commentId]})
        setLikeStatus(updatedLikeStatus)

        try {
            const response = await axios.post('/api/likecomment', {
                PostId:postId,
                commentId
            })
            console.log(response)
        } catch (error) {
            console.log("Error liking comment", error)
        }

        setIsLoading(false)
     }

     if(isLoading){
        return <Skeleton className='w-full h-[40px] dark:bg-neutral-700 bg-neutral-100' />
     }
  return (
    <div className='border-[1px] rounded-md my-4'>
        <div className='py-3 rounded-md p-4'>
            <p className='text-2xl font-medium font-sans'>Comments</p>
            {CommentData.map((comment,index) => (
                <div key={index} className='p-2'>
                    <div className='flex items-center space-x-3'>
                        <Image
                            width={20}
                            height={20}
                            priority
                            className='rounded-full object-cover'
                            src={comment.author.image ? comment.author.image : "/image4.jpg"}
                            alt='User Image'
                        />
                        <p className='font-medium'>{comment.author.name}</p>
                    </div>
                    <p className='py-2 text-neutral-600 text-sm dark:text-white opacity-80 ml-3'>{comment.content}</p>
                    <div className='flex items-center space-x-5 text-sm dark:opacity-75'>
                        <p onClick={() => LikeComment(postId, comment.id)} className={`cursor-pointer  ${IsLoading ? "pointer-events-none" : ""}`}>
                        {likeStatus_1[comment.id] ? (
                                <>
                                    <FaHeart color='red' size={18} />
                                </>
                            ):(
                                <Heart size={18} className='text-neutral-500'/>
                        )}
                        </p>
                        <p onClick={() => toggleShowReply(comment.id)} className='cursor-pointer py-2'>
                            <MessageSquare size={18}/>
                        </p>
                        <p>{new Date(comment.createdAt).toDateString()}</p>
                    </div>
                    {showReply[comment.id] && (
                        <ReplyComment id={comment.id} PostId={comment.postId} />
                    )}
                    {comment.replies.length > 0 && (
                        <Middle_Reply_Comments parentCommentId={comment.id} queryKey={comment.id} />
                    )}
                </div>
            ))}
        </div>
    </div>
  )
}

export default Comment_Section

type Middle_Reply_Comments_Type = {
    parentCommentId:string
    queryKey:string
}


const Middle_Reply_Comments = ({parentCommentId,queryKey} :Middle_Reply_Comments_Type) => {

    const { 
        data: ReplyCommentData = [],
        isLoading,
        refetch,
        isFetching
    } = useQuery<ReplyComment[]>({
        queryKey:[queryKey,"ReplyComment"],
        queryFn: () => axios.get('/api/getReplies', {
            params:{
                parentCommentId
            }
        }).then((res) => res.data),
        staleTime:60 * 1000,
        retry:3,
        enabled:false
    })

    console.log(ReplyCommentData)

    return (
        <div>
            <Button disabled={isFetching} onClick={() => refetch()}
            className='text-sm' size='sm' variant='ghost'
            >
                Replies
            </Button>
            {ReplyCommentData && queryKey === `${ReplyCommentData[0]?.parentCommentId}` && (
                <Reply_Comments ReplyData={ReplyCommentData} />
            )}
        </div>
    )
}

type Reply_Props = {
    ReplyData : ReplyComment[]
}

const Reply_Comments = ({ReplyData}: Reply_Props) => {
    const router = useRouter()
    const {data: Session} = useSession()
    const [IsLoading, setIsLoading] = useState<boolean>(false)
    const [showReply, setShowReply] = useState <{[key:string] : boolean }>({})

    const toggleShowReply = (commentId:string) => {
        setShowReply((prev) => ({...prev, [commentId] : !prev[commentId]}))
    }
    const [likeStatus, setLikeStatus] = useState<{[commentId: string] : boolean}>(
        ReplyData.reduce((acc,comment) => {
            const isLiked = comment.like?.some((li) => li.userId === Session?.user.id)
            acc[comment.id] = isLiked
            return acc
        }, {} as {[commentId: string]: boolean})
     )

     const LikeComment = async (postId: string, commentId: string) => {
        setIsLoading(true)
        const updatedLikeStatus = ({...likeStatus, [commentId]: !likeStatus[commentId]})
        setLikeStatus(updatedLikeStatus)

        try {
            const response = await axios.post('/api/likecomment', {
                PostId:postId,
                commentId
            })
            router.refresh()
            console.log(response)
        } catch (error) {
            console.log("Error liking comment", error)
        }

        setIsLoading(false)
     }
    return (
        <div>
            {ReplyData.map((comment,index) => {
                return(
                    <div key={index} className='my-4 p-2 border-l-[1px]'>
                        <div className='flex items-center space-x-3'>
                        <Image
                            width={20}
                            height={20}
                            priority
                            className='rounded-full object-cover'
                            src={comment.author.image ? comment.author.image : "/image4.jpg"}
                            alt='User Image'
                        />
                        <p className='font-medium'>{comment.author.name}</p>
                        </div>
                        <p className='py-2 text-neutral-600 text-sm dark:text-white opacity-80 ml-3'>{comment.content}</p>
                        <div className='flex items-center space-x-5 text-sm dark:opacity-75'>
                        <p onClick={() => LikeComment(comment.postId, comment.id)} className={`cursor-pointer  ${IsLoading ? "pointer-events-none" : ""}`}>
                        {likeStatus[comment.id] ? (
                                <>
                                    <FaHeart color='red' size={18} />
                                </>
                            ):(
                                <Heart size={18} className='text-neutral-500'/>
                        )}
                        </p>
                        <p onClick={() => toggleShowReply(comment.id)} className='cursor-pointer py-2'>
                            <MessageSquare size={18}/>
                        </p>
                        <p>{new Date(comment.createdAt).toDateString()}</p>
                    </div>
                    {showReply[comment.id] && (
                        <ReplyComment id={comment.id} PostId={comment.postId} />
                    )}
                    {comment.replies.length > 0 && (
                        <Middle_Reply_Comments parentCommentId={comment.id} queryKey={comment.id} />
                    )}
                    </div>
                )
            })}
        </div>
    )
}