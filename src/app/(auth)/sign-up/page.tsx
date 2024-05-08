'use client'
import { useEffect, useState } from "react"
import { useDebounceCallback } from "usehooks-ts";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from 'zod'
import { signUpSchema } from "@/schemas/signUpSchema";
import { Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation";
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
export default function page() {
    const [username, setUsername] = useState('');
    const [usernameMessage, setUsernameMessage] = useState('');
    const [password, setPassword] = useState('');
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const debounced = useDebounceCallback(setUsername, 500)
    const { toast } = useToast();
    const router=useRouter()
    const formSchema = signUpSchema;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: "",
            password: "",
            email: ""
        },
    })
    useEffect(() => {
        async function checkUsername() {
            if (username) {
                try {
                    setIsCheckingUsername(true)
                    console.log(username)
                    const response = await fetch(`/api/check-username-unique?username=${username}`, {
                        method: "GET",
                        headers: {
                            "content-type": "json/application"
                        }
                    })
                    const data = await response.json();
                    setUsernameMessage(data.message)
                    console.log(data)
                    setIsCheckingUsername(false)
                } catch (error) {
                    console.log(error)
                }

            }
        }
        checkUsername();
    }
        , [username])
    const onSubmit = async (data: z.infer<typeof formSchema>) => {
        setIsSubmitting(true)
        try {
            const response = await fetch('/api/sign-up', {
                method: "POST",
                headers: {
                    "content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
            const data2 = await response.json();
            toast({
                title: "Message",
                description: data2.message,
            })
            if(data2.success==true)
                router.replace(`/verify/${username}`)
            console.log(data2)
        } catch (error) {
            toast({
                title: "Message",
                description: 'Sign up error',
                variant: "destructive"
            })
        } finally {
            setIsSubmitting(false)
        }

    }
    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 space-y-8 bg-white
rounded-lg shadow-md m-2">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Join our journey</h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="username" type="text" {...field}
                                            onChange={(e) => {
                                                field.onChange(e)
                                                debounced(e.target.value)
                                            }}
                                        />
                                    </FormControl>
                                    {isCheckingUsername && <Loader2 className="animate-spin" />}
                                    <p className={`text-sm ${usernameMessage === 'username is unique' ? 'text-green-500' : 'text-red-500'}`}>{usernameMessage}</p>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="email" type="email" {...field} />
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
                                        <Input placeholder="password" type="password" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" variant={'default'} disabled={isSubmitting}>
                            {
                                isSubmitting ? <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait
                                </> : 'SignUp'
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
}
