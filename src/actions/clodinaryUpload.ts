import axios from "axios";

type Props = {
    formData: FormData
    fileType:string
}

export const upload = async ({formData, fileType} : Props) => {
    const file = formData.get('file') as File
    formData.append('upload_preset', `${process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}`)

    if(!file){
        throw new Error ('File not found in FormData')
    }
    
    const contentType = fileType


    let cloudinaryUplaodUrl = ''

    if(contentType && contentType.startsWith('image')){
        cloudinaryUplaodUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`
    } else if(contentType && contentType.startsWith('video')){
        cloudinaryUplaodUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`
    } else {
        throw new Error('Unsupported fiel type')
    }

    try {
        const resposne = await axios.post(cloudinaryUplaodUrl, formData, {
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        return resposne.data.url
    } catch (error) {
        console.error('Error uploading to cloudinary', error)
        throw error
    }
}