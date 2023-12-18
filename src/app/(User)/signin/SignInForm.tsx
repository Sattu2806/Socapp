'use client'
import React from 'react'
import { SignInSchema } from '@/ZodSchema/UserSchema'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
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
import { Card, CardHeader } from '@/components/ui/card'
import { useToast } from "@/components/ui/use-toast"
import {signIn, useSession} from 'next-auth/react'
import { useRouter } from 'next/navigation'



type Props = {}

const SignInForm = (props: Props) => {
    const { toast } = useToast()
    const {data:Session, status} = useSession()
    const router = useRouter()
    const form = useForm<z.infer<typeof SignInSchema>>({
        resolver: zodResolver(SignInSchema),
        defaultValues: {
          email: "",
          password:""
        },
      })
     
    async function onSubmit(values: z.infer<typeof SignInSchema>) {

        console.log(values)
      try {
        const response = await signIn('credentials', {
            email:values.email,
            password:values.password
        })
        console.log(response)
        toast({
            description: "User Registered Successfully",
        })
        router.push('/')
      } catch (error) {
        console.log(error)
        toast({
            description: "Something error happpended",
        })
      }
    }

    if(Session){
        router.push('/')
    }

    
    
  return (
    <div className='mt-4 max-w-[1280px] mx-auto'>
        <Card className='p-5 max-w-[600px] mx-auto'>
            <CardHeader className='text-2xl font-semibold text-center'>Sign In</CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type='email' placeholder="email@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input type='password' placeholder="password" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />

                <Button onClick={() => signIn('google')} type='button' className='text-red-500 w-full' variant='outline'>Sign In with Google</Button>

                <Button type="submit">Submit</Button>

                </form>
            </Form>
        </Card>
    </div>
  )
}

export default SignInForm