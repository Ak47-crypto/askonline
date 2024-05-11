'use client'

import React, { useEffect } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Button } from './ui/button';
import { User } from 'next-auth';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';

function Navbar() {
  const router = useRouter();
  const { data: session } = useSession();
  const user: User = session?.user;
  const pathname=usePathname();


  return (
    <nav className="p-4 md:p-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <Link href="/" className="text-xl font-bold mb-2 md:mb-0">
          AskOnline
        </Link>
        {session ? (
          <>
            <span className="mr-4 mb-2">
              Welcome, {user.username || user.email}
            </span>

            <Button onClick={() => signOut()} className="w-full md:w-auto bg-slate-100 text-black" variant='outline'>
              Logout
            </Button>

          </>
        ) : (
          <Link href="/sign-in">
            {pathname.startsWith('/sign-in')||pathname.startsWith('/sign-up')||pathname.startsWith('/u') ? (<div></div>) :
              (<Button className="w-full md:w-auto bg-slate-100 text-black" variant={'outline'}>Login</Button>)}
          </Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;