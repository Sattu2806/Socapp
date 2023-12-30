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
import { Loader2, Plus, UploadCloud } from 'lucide-react'
import { Button } from '../ui/button'
import { upload } from '@/actions/clodinaryUpload'
import axios from 'axios'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'

type Props = {}

const NewPost = (props: Props) => {
    const {data: Session} = useSession()
    const [content, setContent] = useState<string>('')
    const [files, setFiles] = useState<File[]>([])
    const [fileUrls, setFileUrls] = useState<string[]>([])
    const [isloading, setisLoading] = useState<boolean>(false)
    const {toast} = useToast()
    const router = useRouter()

    const handleFileChange = (event : React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files;

        if(selectedFiles){
            const newFiles: File[] = Array.from(selectedFiles)
            
            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i]
                const MaxSizeInByte = 4 * 1024 * 1024 // 4 MB                

                if(file.size > MaxSizeInByte){
                    alert('File size exceeds the limit. Please choose a smaller file')
                    return
                }
            }

            setFiles((prevFiles) => [...newFiles, ...prevFiles])

            const newUrls : string[] = newFiles.map((file) => URL.createObjectURL(file))
            setFileUrls((prevFileUrls) => [...newUrls, ...prevFileUrls])
        }
    }

    const handleDrop = (event: React.DragEvent) => {
        event.preventDefault()
        const droppedFiles = event.dataTransfer.files

        if(droppedFiles.length > 0){
            const newFiles: File[] = Array.from(droppedFiles)
            
            for (let i = 0; i < newFiles.length; i++) {
                const file = newFiles[i]
                const MaxSizeInByte = 4 * 1024 * 1024 // 4 MB                

                if(file.size > MaxSizeInByte){
                    alert('File size exceeds the limit. Please choose a smaller file')
                    return
                }
            }

            setFiles((prevFiles) => [...newFiles, ...prevFiles])

            const newUrls : string[] = newFiles.map((file) => URL.createObjectURL(file))
            setFileUrls((prevFileUrls) => [...newUrls, ...prevFileUrls])
        }
    }

    const handleDragOver = (event: React.DragEvent) => {
        event.preventDefault()
    }
    
    const deleteFiles  = (index:number) => {
        const updateFiles = [...files]
        updateFiles.splice(index,1)
        
        const updateUrls = [...fileUrls]
        updateUrls.splice(index,1)

        setFiles(updateFiles)
        setFileUrls(updateUrls)
    }

    const CreatePost = async () => {
        setisLoading(true)
        const formData = new FormData()
        
        const resultArray = [] // Array of urls from CLodinary
        for (let i = 0; i < files.length; i++) {
            formData.append('file', files[i])            
            const fileType = files[i].type

            try {
                const result = await upload({formData, fileType})
                resultArray.push({url:result, filetype:fileType})
                console.log(resultArray)
                toast({
                    description:'Successfully Upload all files'
                })
            } catch (error) {
                console.log('Error while uploaling images')
                toast({
                    variant:"destructive",
                    description:'Could upload files, post cannot be created'
                })
            }
        }

        if(!content && !resultArray){
            return
        }

        const tags = content.match(/#\w+/g) 

        try {
            const response = await axios.post('/api/createpost', {
                content,
                files:resultArray,
                typePost:'Post',
                tags
            })
            toast({
                description:'Successfully Created Post'
            })
            console.log(response)
            router.refresh()
        } catch (error) {
            console.error('Error creating post : ', error)
            toast({
                variant:"destructive",
                description:'Post cannot be created'
            })
        }

        setisLoading(false)
    }

    console.log(content)

  return (
    <div className='w-2/4 py-5 rounded-md mx-4 px-4'>
        <Card className='p-4'>
            <div className='flex items-center space-x-5'>
                <Image src={Session?.user?.image ? Session.user?.image : '/image4.jpg'} width={40} height={40} alt='Image' className='rounded-full h-[40px] object-cover object-top'/>
                <Dialog>
                    <DialogTrigger className='w-full'>
                        <Input className='w-full' type='text' placeholder='Write a Post ...' />
                    </DialogTrigger>
                    <DialogContent className='max-w-[800px] max-h-[600px] min-h-[200px] overflow-auto'>
                        <DialogHeader>
                            <DialogTitle className='my-2 text-xl'>Make your Post</DialogTitle>
                            <DialogDescription>
                                <ContentArea content = {content} setContent = {setContent}/>
                                <Card onDrop={handleDrop} onDragOver={handleDragOver} className='w-full min-h-[300px] max-md:max-h-[300px] max-h-[600px] hover:border-red-500 border border-dashed rounded-md border-gray-700 relative overflow-auto'>
                                    {fileUrls.length > 0 ? (
                                        <Carousel className='w-full h-full'>
                                            <CarouselContent>
                                                {fileUrls.map((url,index) => (
                                                    <CarouselItem key={index} className='relative'>
                                                        {files[index].type.startsWith('image/') ? (
                                                            <img src={url} alt={files[index].name} />
                                                        ):(
                                                            <video src={url} autoPlay loop muted />
                                                        )}
                                                        <Button
                                                        onClick={() => deleteFiles(index)}
                                                        className='absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 cursor-pointer flex items-center justify-center'
                                                        >
                                                        X
                                                        </Button>
                                                    </CarouselItem>
                                                ))}
                                            </CarouselContent>
                                            <label style={{zIndex:'1000'}} htmlFor="file" className='absolute  bottom-1 right-1 w-10 h-10 rounded-full border-dotted border-[1px] border-black cursor-pointer flex items-center justify-center'>
                                            <Plus className='w-6 h-6' />
                                            <input multiple onChange={handleFileChange} type="file" name="file" id="file" className='hidden' />
                                            </label>
                                            <CarouselPrevious className='left-0' />
                                            <CarouselNext className='right-0' />
                                        </Carousel>
                                    ):(
                                        <label htmlFor="file" className='absolute top-0 left-0 bottom-0 right-0 cursor-pointer flex flex-col items-center justify-center'>
                                            <UploadCloud className='text-3xl opacity-70' />
                                            <span className='block'>Click or deag & drop your files</span>
                                            <span className='block'>Max-size 4MB</span>
                                            <input multiple onChange={handleFileChange} type="file" name="file" id="file" className='hidden' />
                                        </label>
                                    )}
                                </Card>
                                {isloading ? (
                                    <Button disabled className='w-full mt-2' size='lg'>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </Button>
                                ):(
                                <Button className='my-2 w-full ' onClick={CreatePost}>Submit</Button>
                                )}
                            </DialogDescription>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            </div>
        </Card>
    </div>
  )
}

export default NewPost