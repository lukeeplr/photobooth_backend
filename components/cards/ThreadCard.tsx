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
        image: string
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

export default function ThreadCard({ id, currentUser, parentId, content, author, community, createdAt, comments }: ThreadCardProps) {
  return (
    <article className='flex flex-col w-full rounded-xl bg-dark-2 p-7'>
        <div>    
        <Link 
        href={`/profile/${id}`}
        className='relative h-11 w-11'>
            <Image 
            src={author.image} 
            alt={`Foto de perfil de ${author.name}`}
            fill
            className='cursor-pointer rounded-full'
            />
        </Link>
        </div>
        <h2 className="text-small-regular text-light-2">
            {content}
        </h2>
    </article>
  )
}
