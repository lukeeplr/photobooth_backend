import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDateString } from '@/lib/utils'
import ThreadButtons from '../shared/ThreadButtons'
import { wasLiked } from '@/lib/actions/user.actions'

type ThreadCardProps = {
    id: string,
    currentUser: string,
    parentId: string | null,
    content: string, 
    author: {
        id: string,
        name: string,
        image: string,
        username: string
    },
    community: {
        id: string,
        name: string,
        image: string
    } | null,
    createdAt: Date,
    comments: {
        author: {
            image: string
        }
    }[],
    isComment?: boolean
}

export default async function ThreadCard({ id, currentUser, parentId, content, author, community, createdAt, comments, isComment }: ThreadCardProps) {

  const hasLiked = await wasLiked({userId: currentUser, threadId: id})

  return (
    <article className={`flex flex-col w-full rounded-xl ${isComment ? 'px-0 xs:px-7 mt-2' : 'bg-dark-2 p-7'} `}>
        <div className='flex items-start justify-between'>
        <div className='flex w-full flex-1 flex-row gap-4'>
          <div className='flex flex-col items-center'>
            <Link href={`/profile/${author.id}`} className='relative h-11 w-11'>
              <Image
                src={author.image}
                alt='author profile picture'
                fill
                className='cursor-pointer rounded-full'
              />
            </Link>

            <div className='thread-card_bar' />
          </div>

          <div className='flex w-full flex-col'>
            <Link href={`/profile/${author.id}`} className='w-fit flex gap-1.5'>
              <span className='cursor-pointer text-base-semibold text-light-1'>
                {author.name}
              </span>
              <span className='text-base-regular text-light-4'>{`@${author.username}`}</span>
            </Link>

            <p className='mt-2 text-small-regular text-light-2'>{content}</p>

            <div className={`${isComment && 'mb-10'} mt-5 flex flex-col gap-3`}>
              <ThreadButtons threadId={id.toString()} userId={currentUser.toString()} wasLiked={hasLiked}/>

                {isComment && comments.length > 0 && (
                    <Link href={`/thread/${id}`}>
                        <span className='mt-1 text-subtle-medium text-gray-1'>{comments.length} respostas</span>
                    </Link>
                )}

                </div>
            </div>
        </div>
        {/* TODO: Delete thread */}
        {/* TODO: Show comment logos */}
    </div>
        {!isComment && community && (
          <Link href={`/communities/${community.id}`} className='mt-5 flex items-center'>
            <p className='text-subtle-medium text-gray-1'>
              {formatDateString(createdAt.toString())}
              {" "}- Comunidade {community.name}
            </p>
            <div className='relative h-4 w-4'>
            <Image 
              src={community.image}
              alt={community.name}
              fill
              className='ml-1 rounded-full object-cover'
              />
            </div>
          </Link>
        )}

            

    </article>
  )
}
