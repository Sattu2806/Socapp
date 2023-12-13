"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import axios from "axios"

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
import { useToast } from "@/components/ui/use-toast"

type Props = {}

const ForgetPasswordSchema = z.object({
    email: z.string().email().refine(value => !!value, {
        message: "Email is mandatory and should be a valid email address",
    })
})

const ForgotPasswordForm = (props: Props) => {
    const { toast } = useToast()
    const form = useForm<z.infer<typeof ForgetPasswordSchema>>({
        resolver: zodResolver(ForgetPasswordSchema),
    })

    async function onSubmit (values: z.infer<typeof ForgetPasswordSchema>) {
        console.log(values)
        try {
          const response = await axios.post('/api/passwordchange',{
              email:values.email,
          })
          toast({
            description: "Email sent to your registered email",
        })
          console.log(response)
        } catch (error) {
          console.log('Errore', error)
          toast({
            description: "Error while sending Email to your registered email",
            })
        }
    }
  return (
    <div className="mt-4 max-w-[1280px] mx-auto">
    <Card className="p-5 max-w-[600px] mx-auto">
    <h1 className="text-2xl text-center font-medium my-2 mb-6">Password Change</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input type="email" autoComplete="off" placeholder="email@email.com" {...field} />
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

export default ForgotPasswordForm