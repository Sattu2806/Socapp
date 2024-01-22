import React from 'react'
import { Skeleton } from '../ui/skeleton'
import { Card } from '../ui/card'

type Props = {}

const PostSkeleton = (props: Props) => {
  return (
    <div className="mt-8">
      <Card className='w-full h-[400px] p-4'>
        <div className='flex items-center space-x-4'>
            <Skeleton className="w-10 h-10 rounded-full dark:bg-gray-800 bg-gray-100" />
            <Skeleton className="w-[200px] h-3 dark:bg-gray-800 bg-gray-100" />
        </div>
        <Skeleton className='w-full h-[300px] rounded-md dark:bg-gray-800 bg-gray-100 mt-2'/>
      </Card>
    </div>
  )
}

export default PostSkeleton