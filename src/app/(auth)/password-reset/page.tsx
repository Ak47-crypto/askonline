'use client'
import React, { useState } from 'react'
import ReCAPTCHA from "react-google-recaptcha";
import {
    Form,
    FormControl,
    FormLabel,
    FormItem,
    FormField,
    FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'
const emailSchema = z.object({
    email: z.string().email({ message: "Invalid email address" })
})
export default function PasswordReset() {
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const [captcha, setCaptcha] = useState<string | null>()
    const router = useRouter();
    const { toast } = useToast();
    const form = useForm<z.infer<typeof emailSchema>>({
        resolver: zodResolver(emailSchema),
        defaultValues: {
            email: ''
        }
    })
    const onSubmit = async (data: z.infer<typeof emailSchema>) => {
        setIsSubmitting(true)
        try {
            if (!captcha) {
                toast({
                    title: "reCaptcha failed",
                    description: 'please re-verify',
                    variant: 'destructive'
                })
            }
            else {
                const response = await fetch('/api/send-password-otp', {
                    method: "POST",
                    headers: {
                        "content-type": "application/json"
                    },
                    body: JSON.stringify(data)
                })
                const data2 = await response.json();
                console.log(data2)
                if (data2.success == true) {
                    toast({
                        title: "Message",
                        description: data2.message,
                        variant: "default"
                    })
                    const { username } = data2;
                    router.replace(`/password-code-verify/${username}?validRedirection=true`)
                    // router.push()
                }
                else
                    toast({
                        title: "Message",
                        description: data2.message,
                        variant: "destructive"
                    })
            }
        } catch (error: any) {
            toast({
                title: "Message",
                description: "Some error occured",
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }
    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-800">
                <div className="w-full max-w-md p-8 space-y-8 bg-white
rounded-lg shadow-md m-2 mb-20">
                    <div className="text-center">
                        <h1 className="text-2xl font-extrabold tracking-tight lg:text-4xl mb-6">Reset Your Password</h1>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter your Email address</FormLabel>
                                        <FormControl >
                                            <Input placeholder="email" type="text" {...field}
                                                required
                                            />

                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex justify-center'>
                                <ReCAPTCHA
                                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string}
                                    onChange={setCaptcha}

                                />
                            </div>
                            <Button type="submit" variant={'default'} disabled={isSubmitting}>
                                {
                                    isSubmitting ? <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                                    </> : 'Submit'
                                }
                            </Button>
                        </form>
                    </Form>
                </div>
            </div>


        </>
    )
}
