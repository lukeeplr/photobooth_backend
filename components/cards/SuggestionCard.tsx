import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


type SuggestionCardProps = {
    id: string,
    name: string,
    username: string,
    imageUrl: string,
    suggestionType: string
}

export default function SuggestionCard({ id, name, username, imageUrl, suggestionType }: SuggestionCardProps) {
  return (
    <>
        <Link 
        href={`/${suggestionType}/${id}`}
        className='p-2 mb-2'
        >
        
        <article className='user-card'>
        <div className="user-card_avatar items-center">
            <div className='relative h-14 w-14'>
            <Image
            src={imageUrl}
            alt={`foto de perfil de @${username}`}
            fill
            className='rounded-full object-cover'
            />
            </div>
            <div className='flex-1 text-ellipsis whitespace-nowrap'>
                <h4 className="text-base-semibold text-light-1">{name}</h4>
                <p className='text-small-medium text-light-4'>@{username}</p>
            </div>
        </div>
        </article>

        </Link>
    </>
  )
}
