'use client'
import React, { useState } from 'react'
import {
    Form,
    FormField,
    FormLabel,
    FormControl,
    FormMessage,
    FormItem,
} from '@/components/ui/form'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
 
import { Loader2 } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { acceptMessageSchema } from '@/schemas/messageSchema'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams } from 'next/navigation'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
export default function UserBoard() {
    const params = useParams()
    const username = params.username
    const [isLoading, setIsLoading] = useState(false)
    const form = useForm<z.infer<typeof acceptMessageSchema>>({
        resolver: zodResolver(acceptMessageSchema),
        defaultValues: {
            content: ''
        }
    })
    const watchInput = form.watch('content')
    const MessageArray = ["Favorite movie genre?",
    "Last vacation spot?",
    "Dream job?",
    "Go-to comfort food?",
    "Morning routine?",
    "Favorite hobby?",
    "Best childhood memory?",
    "Next travel destination?",
    "Recent Netflix binge?",
    "Favorite season?"]
    const handleMessageOnTextarea=(msg:string)=>{
        form.setValue('content',msg)
        toast({
            title:"message",
            description:"message inserted in textarea"
        })
    }
    const onSubmit = async (data: z.infer<typeof acceptMessageSchema>) => {
        console.log('hi');
        try {
            setIsLoading(true)
            const response = await fetch('/api/send-messages', {
                method: 'POST',
                headers: {
                    "content-type": "applicaton/json"
                },
                body: JSON.stringify({ ...data, username })
            })
            const data2 = await response.json()
            if (data2.success == true) {
                toast({
                    title: "message",
                    description: "message send successfully"
                })
            }
            else {
                toast({
                    title: "message",
                    description: data2.message,
                    variant:'destructive'
                })
            }
        } catch (error) {

            toast({
                title: "message",
                description: "some error occure"
            })
        } finally {
            setIsLoading(false)

        }
    }
    return (
        <div className="container mx-auto my-8 p-6 bg-white rounded max-w-4xl">
            <h1 className="text-4xl font-bold mb-6 text-center">
                Public Profile Link
            </h1>
            <p className='text-sm font-semibold mb-2'>Send Anonymous Message to @{username}</p>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                        control={form.control}
                        name="content"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Textarea
                                        placeholder="Write your anonymous message here"
                                        className="resize-none"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="flex justify-center">
                        {isLoading ? (
                            <Button disabled>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Please wait
                            </Button>
                        ) : (
                            <Button type="submit" disabled={isLoading||!watchInput}>
                                Send It
                            </Button>
                        )}
                    </div>
                </form>
            </Form>
            <Card className='mt-5'>
                <CardHeader>
                    <CardTitle className='text-xl font-semibold'>Suggested messages</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col space-y-4">
                    {MessageArray.map((msg,index)=>(
                        <Button 
                         className='mb-2'
                         variant={'outline'}
                         key={index}
                         onClick={()=>handleMessageOnTextarea(msg)}>
                            {msg}
                        </Button>
                    )
                    )}
                </CardContent>
            </Card>
            <Separator className="my-6" />
      <div className="text-center">
        <div className="mb-4">Get Your Message Board</div>
        <Link href={'/sign-up'}>
          <Button>Create Your Account</Button>
        </Link>
      </div>
    </div>
        
        
    )
}
