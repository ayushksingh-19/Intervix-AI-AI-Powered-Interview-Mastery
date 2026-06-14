"use client"
import { usePathname, useRouter } from 'next/navigation';
import React from 'react'
import Image from 'next/image'
import { AuthUserButton } from '@/components/auth/AuthSupport'

function Header() {
    const path = usePathname();
    const router =useRouter()
    function getRoutLink(path){
       router.push(path)
    }


  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <Image src={'/logo.svg'} width={160} height={100} alt='logo' />
      <ul className='hidden md:flex gap-6'>
      
        <li onClick={()=>getRoutLink('/dashboard')} className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard'&&'text-primary font-bold'}`}>Dashboard</li>
       
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/questions'&&'text-primary font-bold'}`}>Questions</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/upgrade'&&'text-primary font-bold'}`}>Upgrade</li>
        <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer  ${path=='/dashboard/how'&&'text-primary font-bold'}`}>How it works?</li>
      </ul>
      <AuthUserButton />
    </div>
  )
}

export default Header
