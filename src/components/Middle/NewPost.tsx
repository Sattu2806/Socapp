'use client'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Card } from '../ui/card'
import Image from 'next/image'
import { useSession } from 'next-auth/react'
import { Input } from '../ui/input'
import ContentArea from '../Editor/ContentArea'
import { BookImage, Loader2, Plus, UploadCloud, Video } from 'lucide-react'
import { Button } from '../ui/button'
import { upload } from '@/actions/clodinaryUpload'
import axios from 'axios'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { EditorContent } from '@tiptap/react'
import { TypePost } from '@prisma/client'
import PostCreationDialogue from './PostCreationDialogue'

type Props = {}

const NewPost = (props: Props) => {
    const {data: Session} = useSession()
    const [title, setTitle] = useState<string>('')
    const [typePost, setTypePost] = useState<TypePost>()
    const [openDialgoue, setOpenDialogue] = useState<boolean>(false)
  return (
    <div className='py-5 rounded-md'>
        <Card className='p-4'>
            <div className='flex items-center space-x-5'>
                <Image src={Session?.user?.image ? Session.user?.image : '/image4.jpg'} width={40} height={40} alt='Image' className='rounded-full h-[40px] object-cover object-top'/>
                <Input onClick={() => {setTitle('Make Your Post'); setTypePost(TypePost.POST); setOpenDialogue(true)}} className='w-full' type='text' placeholder='Write a Post ...' />
            </div>
            <div className='flex items-center justify-between mt-4 px-5'>
                <div onClick={() => {setTitle('Video Post'); setTypePost(TypePost.VIDEO); setOpenDialogue(true)}} className='flex items-center space-x-2 opacity-60 text-sm cursor-pointer p-1 rounded-md'>
                <Video/>
                <span>Video</span>
                </div>
                <div onClick={() => {setTitle('Image'); setTypePost(TypePost.IMAGE); setOpenDialogue(true)}} className='flex items-center space-x-2 opacity-60 text-sm cursor-pointer p-1 rounded-md'>
                <BookImage/>
                <span>Image</span>
                </div>
                <Button onClick={() => {setTitle('Make Your Post'); setTypePost(TypePost.POST); setOpenDialogue(true)}} className='px-5'>Post</Button>
            </div>
        </Card>
        <PostCreationDialogue title={title} typePost={typePost} openDialgoue = {openDialgoue} setOpenDialogue={setOpenDialogue}/>
    </div>
  )
}

export default NewPost