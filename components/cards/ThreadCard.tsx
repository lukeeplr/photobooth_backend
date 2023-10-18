import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

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

export default function ThreadCard({ id, currentUser, parentId, content, author, community, createdAt, comments, isComment }: ThreadCardProps) {
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

            <div className={'mt-5 flex flex-col gap-3'}>
              <div className='flex gap-3.5'>
                {/* TODO: like functionality */}
                <Image
                  src='/assets/heart-gray.svg'
                  alt='botão de curtir'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Link href={`/thread/${id}`}>
                  <Image
                    src='/assets/reply.svg'
                    alt='botão de responder'
                    width={24}
                    height={24}
                    className='cursor-pointer object-contain'
                  />
                </Link>
                <Image
                  src='/assets/repost.svg'
                  alt='botão de repostar'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                />
                <Image
                  src='/assets/share.svg'
                  alt='botão de compartilhar'
                  width={24}
                  height={24}
                  className='cursor-pointer object-contain'
                  />
                </div>

                {isComment && comments.length > 0 && (
                    <Link href={`/thread/${id}`}>
                        <span className='mt-1 text-subtle-medium text-gray-1'>{comments.length} respostas</span>
                    </Link>
                )}

                </div>
            </div>
        </div>
    </div>

            

    </article>
  )
}
