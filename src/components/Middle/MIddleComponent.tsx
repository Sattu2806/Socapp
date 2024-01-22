import React from 'react'
import NewPost from './NewPost'
import PostRender from './PostRender'
import QueryWrapper from '../QueryWrapper'

type Props = {}

const MIddleComponent = (props: Props) => {
  return (
    <div>
        <NewPost/>
        <QueryWrapper>
          <PostRender/>
        </QueryWrapper>
    </div>
  )
}

export default MIddleComponent