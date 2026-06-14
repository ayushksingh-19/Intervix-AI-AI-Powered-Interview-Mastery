"use client"
import { getDb } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { GUEST_EMAIL, useOptionalUser } from '@/components/auth/AuthSupport'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import InterviewItemCard from './InterviewItemCard';

function Interviewlist() {
    const { isLoaded, user } = useOptionalUser();
    const [interviewList,setInterviewList]=useState([])
    const [error, setError] = useState("")
    useEffect(()=>{
         if (isLoaded) {
          GetInterviewList()
         }
    },[isLoaded, user])
    const GetInterviewList=async()=>{
        try {
            const result=await getDb().select().from(MockInterview).where(eq(MockInterview.createdBy,user?.primaryEmailAddress?.emailAddress ?? GUEST_EMAIL)).orderBy(desc(MockInterview.id))
            setInterviewList(result)
            setError("")
        } catch (err) {
            console.error(err)
            setError(err.message || "Unable to load previous interviews right now.")
        }
    }
  return (
    <div>
        <h2 className='font-medium text-xl'>Previous Mock Interview</h2>
        {error && (
            <p className='mt-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800'>
                {error}
            </p>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>
            {
                interviewList&&interviewList.map((interview,index)=>(
                    <InterviewItemCard key={index} interviewInfo={interview} />                ))
            }
        </div>
    </div>
  )
}

export default Interviewlist
