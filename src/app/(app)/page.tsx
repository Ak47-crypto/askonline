'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Mail } from 'lucide-react'; // Assuming you have an icon for messages
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';

import Autoplay from 'embla-carousel-autoplay';
// import messages from '@/messages.json';
import { useSession } from 'next-auth/react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { User } from 'next-auth';
export default function Home() {
  const router=useRouter();
  const { data: session } = useSession();
  const user : User = session?.user;
  const messages = [
    {
      "title": "Message from User123",
      "content": "Hey, how are you doing today?",
      "received": "10 minutes ago"
    },
    {
      "title": "Message from SecretAdmirer",
      "content": "I really liked your recent post!",
      "received": "2 hours ago"
    },
    {
      "title": "Message from MysteryGuest",
      "content": "Do you have any book recommendations?",
      "received": "1 day ago"
    }
  ]
  return (
    <>
      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-24 py-12 bg-gray-800 text-white">
        <section className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold">
            Dive into the World of Anonymous Feedback
          </h1>
          <p className="mt-3 md:mt-4 text-base md:text-lg">
            AskOnline - Where your identity remains a secret.
          </p>
        </section>

        {/* Carousel for Messages */}
        <Carousel
          plugins={[Autoplay({ delay: 2000 })]}
          className="w-full max-w-lg md:max-w-xl ml-5"
        >
          <CarouselContent>
            {messages.map((message, index) => (
              <CarouselItem key={index} className="p-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{message.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col md:flex-row items-start space-y-2 md:space-y-0 md:space-x-4">
                    <Mail className="flex-shrink-0" />
                    <div>
                      <p>{message.content}</p>
                      <p className="text-xs text-muted-foreground">
                        {message.received}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        {user&&<Button onClick={() => router.replace('dashboard')} className=" mt-10 w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Go to Dashboard
            </Button>}
        
      </main>

      {/* Footer */}
      <footer className="text-center p-4 md:p-6 bg-gray-900 text-white">
        © 2023 AskOnline. All rights reserved.
      </footer>
    </>
  );
}