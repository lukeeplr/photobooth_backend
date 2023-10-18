'use client'
import Image from 'next/image'
import React from 'react'
import { usePathname } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel
} from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { Input } from '@/components/ui/input'

import { CommentValidation } from '@/lib/validations/thread'
import { addComment } from '@/lib/actions/thread.actions'

type CommmentProps = {
    threadId: string,
    currentUserId: string,
    currentUserImage: string
}

export default function Comment({threadId, currentUserId, currentUserImage}: CommmentProps) {

    const pathname = usePathname()


    const form = useForm({
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: '',
            author: currentUserId
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        await addComment({
          userId: JSON.parse(currentUserId),
          threadId: threadId,
          thread: values.thread,
          path: pathname
        })

        form.reset()
    }

  return (
    <Form {...form}>
    <form 
    onSubmit={form.handleSubmit(onSubmit)} 
    className="comment-form">
    <FormField
          control={form.control}
          name="thread"
          render={({ field }) => (
              <FormItem className='flex w-full items-center gap-3'>
                <FormLabel>
                <div className='relative h-12 w-12'>
                    <Image 
                    src={currentUserImage}
                    alt='foto de perfil do usuário'
                    fill
                    className='rounded-full object-cover'
                    />
                </div>
                </FormLabel>
              <FormControl className='border-none bg-transparent'>
                <Input 
                placeholder="Escreva um comentário..." {...field}
                className='no-focus text-light-1 outline-none' 
                />
              </FormControl>
            </FormItem>
        )}/>
        <Button type="submit" className='comment-form_btn hover:bg-primary-500/70 transition-all duration-500'>Publicar</Button>
    </form>
    </Form>
  )
}
