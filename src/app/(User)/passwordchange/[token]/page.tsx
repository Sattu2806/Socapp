import React from 'react'
import PasswordChangeForm from '../PasswordChangeForm'

type Props = {}

const page = ({params}: {params: {token: string}}) => {
    const Token = params.token
    console.log(Token)
  return (
    <div>
      <PasswordChangeForm token={Token}/>
    </div>
  )
}

export default page