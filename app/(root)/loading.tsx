import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"


export default function Loading() {
  return (
    <>
    <h1 className="head-text">Carregando...</h1>
    <section className="mt-9 flex flex-col gap-10 w-[90%] sm:w-full sm:max-w-4xl">
      {Array.from({ length: 10 }).map((_, i) => (
       <article className={`flex flex-col w-full rounded-xl bg-dark-2 p-7`}>
       <div className='flex items-start justify-between'>
           <div className='flex w-full flex-1 flex-row gap-4'>
               <div className='flex flex-col items-center'>
                   <Skeleton className='relative h-11 w-11 rounded-full bg-dark-4' />
               </div>
               <div className='flex w-full flex-col'>
                   <div className='w-fit flex gap-1.5'>
                       <Skeleton className='w-20 h-4 bg-dark-4'/>
                   </div>
                   <Skeleton className='mt-2 h-4 w-60 bg-dark-4'/>
               </div>
           </div>
       </div>
   </article> 
      ))}
    </section>
    </>
  )
}
