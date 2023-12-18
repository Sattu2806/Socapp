'use client'
import React, { useState } from 'react'
import { PasswordSchema } from "@/ZodSchema/UserSchema"
import { SubmitHandler, useForm} from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import axios from 'axios'
import {z} from "zod"
import { useToast } from '@/components/ui/use-toast'

type Props = {
    token:string
}

type PasswordT = z.infer< typeof PasswordSchema>

const PasswordChangeForm = ({token}: Props) => {
    const [success, setSuccess] = useState(false)
    const form = useForm<PasswordT>({
        resolver: zodResolver(PasswordSchema),
        defaultValues:{
        }
    })
    const router = useRouter()
    const { toast } = useToast()
    const onSubmit: SubmitHandler<PasswordT> = async (data) => {
        console.log(data, token)
           try {
            const response = await axios.patch('/api/passwordchange',{
                token,
                newpassword:data.newpassword
            })
            toast({
                description: "Password changed successfuly",
            })
            console.log(response.data)
            router.push('/signin')
           } catch (error) {
            console.log(error)
            toast({
                description: "Error changing password",
            })
           }
    }

     
  return (
    <div className="mt-4 max-w-[1280px] mx-auto">
    <Card className="p-5 max-w-[600px] mx-auto">
    <h1 className="text-2xl text-center font-medium my-2 mb-6">Reset Password</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Enter your new Password" {...field} />
              </FormControl>
              <FormDescription>
                Password must contain 
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newpassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Confirmed New password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="confirm new password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button size='lg' type="submit">Submit</Button>
      </form>
    </Form>
    </Card>
    </div>
  )
}

export default PasswordChangeForm