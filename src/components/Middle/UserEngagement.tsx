import React, { useState } from 'react'
import { PostData } from './PostRender'
import { useSession } from 'next-auth/react'
import axios from 'axios'
import {FaHeart} from "react-icons/fa"
import { Heart, Loader2, MessageSquare } from 'lucide-react'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

type Props = {
    post:PostData
}

const UserEngagement = ({post}: Props) => {
    const {data: Session} = useSession()
    const [isLoading, setisLoading] = useState<boolean>(false)
    const [CommentContent, setCommentContent] = useState<string>('')
    const [openDialgoue, setOpenDialogue] = useState<boolean>(false)
    const router = useRouter()

    const isLiked = post.like.some((like) => like.userId === Session?.user.id)
    const [isLike, setIsLike] = useState<boolean>(isLiked)

    const LikePost = async () => {
        setIsLike(!isLike)
        setisLoading(true)
        try {
            const response = await axios.post('/api/likepost', {
                PostId:post.id
            })
            console.log(response.data)
        } catch (error) {
            setIsLike(isLiked)
            console.log("Error liking the post", error)
        }
        setisLoading(false)
    }

    const CommentPost = async () => {
        setisLoading(true)
        try {
            const response = await axios.post('/api/commentpost',{
                PostId: post.id,
                Content:CommentContent
            })
            setCommentContent('')
            setOpenDialogue(false)
            console.log(response.data)
        } catch (error) {
            console.log("Error while commenting the post", error)
        }
    }
  return (
    <div className='flex items-center justify-between text-sm px-5'>
        <div onClick={LikePost} className={`flex items-center space-x-2 cursor-pointer ${isLoading ? "opacity-50 pointer-events-none":""}`}>
            {isLike ? (
                <>
                    <FaHeart color='red' size={22} />
                </>
            ):(
                <Heart className='text-neutral-500'/>
            )}
        </div>
        <div className='flex items-center space-x-2 cursor-pointer'>
            <Dialog open={openDialgoue} >
                <DialogTrigger onClick={() => setOpenDialogue(true)} asChild>
                    <MessageSquare />
                </DialogTrigger>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        Comment on this post
                    </DialogHeader>
                    <div className='flex items-center space-x-2'>
                        <Label htmlFor='comment' className='sr-only'>Comment</Label>
                        <Textarea 
                        id='comment'
                        onChange={(e) => setCommentContent(e.target.value)}
                        />
                    </div>
                    <div className='flex items-center space-x-4'>
                    <DialogFooter className='sm:justify-start'>
                        {isLoading ? (
                            <Button disabled className='w-full mt-2' size='lg'>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ):(
                        <Button type='button' variant='default' onClick={CommentPost}>Submit</Button>
                        )}
                    </DialogFooter>
                    <DialogClose onClick={() => setOpenDialogue(false)}>
                        <Button type='button' variant='secondary'>
                            Cancel
                        </Button>
                    </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    </div>
  )
}

export default UserEngagement