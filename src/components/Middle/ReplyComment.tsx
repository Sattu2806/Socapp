import React, { useState } from 'react'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'
import axios from 'axios'

type Props = {
    id:string
    PostId:string
}

const ReplyComment = ({id, PostId}: Props) => {
    const [commentContent, setCommentContent] = useState<string | undefined>(undefined)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const ReplyComment = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post('/api/replycomment', {
                PostId,
                Content:commentContent,
                parentCommentId:id
            })
            
            console.log(response)
        } catch (error) {
            console.log("Error replying to comment", error)
        }
        setIsLoading(false)
    }
  return (
    <div>
        <div className='flex items-center space-x-2 mb-3'>
            <Textarea 
            id='comment'
            onChange={(e) => setCommentContent(e.target.value)}
            />
        </div>
        <Button disabled={isLoading} onClick={() => ReplyComment()} variant='default' size='sm'>Submit</Button>
    </div>
  )
}

export default ReplyComment