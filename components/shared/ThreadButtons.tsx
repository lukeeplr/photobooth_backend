'use client'

import { likeThread } from '@/lib/actions/user.actions'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

type ThreadButtonsProps = {
    threadId: string
    userId: string
    wasLiked: boolean
}

async function ThreadButtons({threadId, userId, wasLiked}: ThreadButtonsProps) {

  const router = useRouter()
  const onLike = () => {
    if (!userId) {
      router.push('/sign-in')
    } else {
      likeThread({userId, threadId})
    }
  }

  return (
    <div className='flex gap-3.5'>
                <Image
                  src={wasLiked? '/assets/heart-filled.svg' : '/assets/heart-gray.svg'}
                  alt='botão de curtir'
                  width={24}
                  height={24}
                  className='button-animation'
                  onClick={onLike}
                />
                <Link href={`/thread/${threadId}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='botão de responder'
                    width={24}
                    height={24}
                    className='button-animation'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='botão de repostar'
                  width={24}
                  height={24}
                  className='button-animation'
                />
                <Image
                  src='/assets/share.svg'
                  alt='botão de compartilhar'
                  width={24}
                  height={24}
                  className='button-animation'
                  />
                </div>
  )
}

export default ThreadButtons