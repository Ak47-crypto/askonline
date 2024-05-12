'use client'
import React, { useEffect, useState } from 'react'
import {
    Form,
    FormControl,
    FormLabel,
    FormItem,
    FormField,
    FormMessage
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import  {z} from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useRouter,useParams ,useSearchParams} from 'next/navigation'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'


const passwordChangeSchema=z.object({
    password:z.string().min(6,{message:"password must be at least 6 characters long"}),
    code:z.string().min(6,{message:"Code must be 6 characters long"}),
})
export default function PasswordCodeVerify() {
    const searchParams=useSearchParams()
    const validRedirection=searchParams.get('validRedirection');
    const {toast}=useToast()
    const router=useRouter()
    const params=useParams()
    const username=params.username
    const [isSubmitting,setIsSubmitting]=useState(false)
    const form = useForm<z.infer<typeof passwordChangeSchema>>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            password:'',
            code:''
        }
    })
    useEffect(() => {
        // Check if the user is coming from a valid redirection
        if (!validRedirection) {
          // If not, redirect to the home page
          router.replace('/');
        }
      }, [validRedirection]);
    const onSubmit=async (data:z.infer<typeof passwordChangeSchema>)=>{
        setIsSubmitting(true);
        try {
            const response = await fetch('/api/verify-password-otp',{
                method:"POST",
                headers:{
                    "content-type":"application/json"
                },
                body:JSON.stringify({...data,username})
            })
            const data2=await response.json();
            if(data2.success==true){
                toast({
                    title:"Message",
                    description:data2.message,
                    variant:"default"
                })
                
                router.replace('/sign-in')
            }
            else
                {
                    toast({
                        title:"Message",
                        description:data2.message,
                        variant:"destructive"
                    }) 
                }
        } catch (error) {
            toast({
                title:"Message",
                description:"Some error occured",
                variant:"destructive"
            }) 
        }finally{
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
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter your new password</FormLabel>
                                        <FormControl >
                                            <Input placeholder="password" type="text" {...field}
                                                
                                            />
                                        </FormControl>
                                    <FormMessage/>

                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Enter Code</FormLabel>
                                        <FormControl >
                                            <Input placeholder="code" type="text" {...field}
                                                
                                            />
                                        </FormControl>
                                        <FormMessage/>

                                    </FormItem>
                                )}
                            />
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
