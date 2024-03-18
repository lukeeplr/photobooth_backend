'use client'

import React from 'react'
import { useOrganization } from '@clerk/nextjs'
import { usePathname, useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Textarea } from '@/components/ui/textarea'

import { ThreadValidation } from '@/lib/validations/thread'
import { createThread } from '@/lib/actions/thread.actions'
import { useToast } from '../ui/use-toast'

export default function PostThread({ userId }: { userId: string }) {

  const pathname = usePathname()
  const router = useRouter()
  const { organization } = useOrganization()
  const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(ThreadValidation),
        defaultValues: {
            thread: '',
            author: userId
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>) => {
        await createThread({
          author: userId,
          thread: values.thread,
          community: organization ? organization.id : null,
          path: pathname
        })

        router.push('/')     
        
        toast({
          description: 'Publicação criada!'
        })
    }

  return (
    <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)} 
    className="flex flex-col justify-start gap-10 mt-10">
    <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
              <FormItem>
              <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                <Textarea 
                rows={15}
                placeholder="O que está acontecendo?" {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
        )}/>
        <Button type="submit" className='bg-primary-500 hover:bg-primary-500/70 transition-all duration-500'>Publicar</Button>
    </form>
    </Form>
  )
}
