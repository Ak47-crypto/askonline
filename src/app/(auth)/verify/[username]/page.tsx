'use client'
import React, { useState } from 'react'
import UserModel from '@/model/user'
import { useRouter, useParams } from 'next/navigation'
import { toast } from '@/components/ui/use-toast'
import { verifyCodeSchema } from '@/schemas/verifyCodeSchema'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
export default function Verify() {
    
    const [isSubmitting, setIsSubmitting] = useState(false)
    // const [username,setUsername]=useState('')
    const form = useForm<z.infer<typeof verifyCodeSchema>>({
        resolver: zodResolver(verifyCodeSchema),
        defaultValues: {
            code: ''
        }
    })
    const params = useParams();
    const router = useRouter()
    const onSubmit = async (data: z.infer<typeof verifyCodeSchema>) => {
        try {
            setIsSubmitting(true)
            console.log(data)
            const username = params.username
            const response = await fetch('/api/verify-code', {
                method: 'POST',
                headers: {
                    'conten-type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    code: data.code
                })
            })
            const data2 = await response.json();
            console.log(data2)
            if (data2.success == true) {
                toast({
                    title: 'message',
                    description: data2.message
                })
                // router.replace('/sign-in')
                router.push('/sign-in')
            }
            else {
                toast({
                    title: 'message',
                    description: data2.message,
                    variant: 'destructive'

                })
            }
        } catch (error: any) {
            toast({
                title: 'message',
                description: 'Some error occured',
                variant: 'destructive'
            })
            console.log(error)
        } finally {
            setIsSubmitting(false)
        }

    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white
rounded-lg shadow-md m-2">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Verify Your Account</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Enter Your Code</FormLabel>
                                    <FormControl>
                                        <Input placeholder="code" type="text" {...field}

                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant={'default'} disabled={isSubmitting}>
                            {
                                isSubmitting ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                                </> : 'Verify'
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
