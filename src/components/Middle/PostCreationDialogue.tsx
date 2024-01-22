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
import { Input } from '../ui/input'
import ContentArea from '../Editor/ContentArea'
import { Loader2, Plus, UploadCloud } from 'lucide-react'
import { Button } from '../ui/button'
import { upload } from '@/actions/clodinaryUpload'
import axios from 'axios'
import { useToast } from '../ui/use-toast'
import { useRouter } from 'next/navigation'
import { EditorContent } from '@tiptap/react'
import { TypePost } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { Textarea } from '../ui/textarea'

type Props = {
    title:string
    typePost:TypePost | undefined
    openDialgoue:boolean
    setOpenDialogue: React.Dispatch<React.SetStateAction<boolean>>
}

const PostCreationDialogue = ({title, typePost, openDialgoue, setOpenDialogue}: Props) => {
    const {data: Session} = useSession()
    const [content, setContent] = useState<string>('')
    const [files, setFiles] = useState<File[]>([])
    const [fileUrls, setFileUrls] = useState<string[]>([])
    const [isloading, setisLoading] = useState<boolean>(false)
    const [description, setdescription] = useState<string[]>(new Array(files.length).fill(''))
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

            setFiles((prevFiles) => [...prevFiles,...newFiles])

            const newUrls : string[] = newFiles.map((file) => URL.createObjectURL(file))
            setFileUrls((prevFileUrls) => [...prevFileUrls, ...newUrls])
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

            setFiles((prevFiles) => [...prevFiles,...newFiles])

            const newUrls : string[] = newFiles.map((file) => URL.createObjectURL(file))
            setFileUrls((prevFileUrls) => [...prevFileUrls, ...newUrls])
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

        if((typePost === TypePost.VIDEO || typePost === TypePost.IMAGE) && (files.length < 1 || fileUrls.length < 1)){
            alert('Please select a file')
            setisLoading(false)
            return
        }
        
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

        if(typePost === TypePost.POST && (content === `<p></p>`)){
            setisLoading(false)
            alert('Content is required')
            console.log('retuned the function for post')
            return
        }
        if((typePost === TypePost.VIDEO || typePost === TypePost.IMAGE) && (resultArray.length < 1)){
            console.log('retuned the function for video and image post')
            alert('Please upload a file')
            setisLoading(false)
            return
        }

        let tags:string[] = []
        if(typePost === TypePost.POST){
            const match = content.match(/#\w+/g) 
            tags = match ? match : []
        }else if(typePost === TypePost.IMAGE || typePost === TypePost.VIDEO){
            const match = description.map((desc) => desc.match(/#\w+/g)) 
            tags = match.flat().filter((mat) => mat !== null) as string[]
        }

        try {
            if(typePost === TypePost.POST){
                const response = await axios.post('/api/createpost', {
                    content,
                    files:resultArray,
                    typePost:TypePost.POST,
                    tags
                })
                console.log(response)
            }else if(typePost === TypePost.IMAGE || typePost === TypePost.VIDEO){
                const response = await axios.post('/api/createpost', {
                    files:resultArray.map((result, index) => ({
                        ...result,
                        description:description[index]
                    })),
                    tags,
                    typePost
                })
                console.log(response)
            }
            toast({
                description:'Successfully Created Post'
            })
            window.location.reload()
            // setOpenDialogue(false)
            // setdescription([])
            // setContent('<p><p>')
            // setFiles([])
            // setFileUrls([])
        } catch (error) {
            console.error('Error creating post : ', error)
            toast({
                variant:"destructive",
                description:'Post cannot be created'
            })
        }

        setisLoading(false)
    }
  return (
    <div>
        <Dialog open={openDialgoue}>
            <DialogContent className='max-w-[800px] max-h-[600px] min-h-[200px] overflow-auto'>
            <div onClick={() => setOpenDialogue(false)} className="absolute right-4 top-4 cursor-pointer rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <Cross2Icon className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </div>
                <DialogHeader>
                    <DialogTitle className='my-2 text-xl'>{title}</DialogTitle>
                    <DialogDescription>
                        {typePost === TypePost.POST && (
                            <ContentArea content = {content} setContent = {setContent}/>
                        )}
                        <Card onDrop={handleDrop} onDragOver={handleDragOver} className='w-full min-h-[300px] max-md:max-h-[300px] max-h-[600px] hover:border-red-500 border border-dashed rounded-md border-gray-700 relative overflow-auto'>
                            {fileUrls.length > 0 ? (
                                <Carousel className='w-full h-full'>
                                    <CarouselContent>
                                        {fileUrls.map((url,index) => (
                                            <CarouselItem key={index} className='relative'>
                                                {files[index].type.startsWith('image/') ? (
                                                    <>
                                                    <img src={url} alt={files[index].name} />
                                                    {typePost === TypePost.IMAGE && (
                                                        <Textarea 
                                                            value={description[index]}
                                                            onChange={(e) => {
                                                                const updatedDescription = [...description]
                                                                updatedDescription[index] = e.target.value;
                                                                setdescription(updatedDescription)
                                                            } }
                                                            className='absolute bottom-0 left-2 right-2 bg-transparent border-none dark:bg-gray-700'
                                                            placeholder='Enter the description'
                                                        />
                                                    )}
                                                    </>
                                                ):(
                                                    <>
                                                    <video src={url} autoPlay loop muted />
                                                    {typePost === TypePost.VIDEO && (
                                                        <Textarea 
                                                            value={description[index]}
                                                            onChange={(e) => {
                                                                const updatedDescription = [...description]
                                                                updatedDescription[index] = e.target.value;
                                                                setdescription(updatedDescription)
                                                            } }
                                                            className='absolute bottom-0 left-2 right-2 bg-transparent border-none dark:bg-gray-700'
                                                            placeholder='Enter the description'
                                                        />
                                                    )}
                                                    </>
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
                                    {typePost !== TypePost.VIDEO && (
                                    <>
                                    <label style={{zIndex:'1000'}} htmlFor="file" className='absolute  bottom-1 right-1 w-10 h-10 rounded-full border-dotted border-[1px] border-black cursor-pointer flex items-center justify-center'>
                                    <Plus className='w-6 h-6' />
                                    <input accept={typePost === TypePost.IMAGE ? "image/*" : "*"}  multiple onChange={handleFileChange} type="file" name="file" id="file" className='hidden' />
                                    </label>
                                    <CarouselPrevious className='left-0' />
                                    <CarouselNext className='right-0' />
                                    </>
                                    )}
                                </Carousel>
                            ):(
                                <label htmlFor="file" className='absolute top-0 left-0 bottom-0 right-0 cursor-pointer flex flex-col items-center justify-center'>
                                    <UploadCloud className='text-3xl opacity-70' />
                                    <span className='block'>Click or deag & drop your files</span>
                                    <span className='block'>Max-size 4MB</span>
                                    <input accept={typePost === TypePost.IMAGE ? "image/*" : typePost === TypePost.VIDEO ? "video/*" : "*"} multiple = {typePost !== TypePost.VIDEO ? true : false} onChange={handleFileChange} type="file" name="file" id="file" className='hidden' />
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
  )
}

export default PostCreationDialogue