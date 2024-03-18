'use client'

import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'

type UserCardProps = {
    id: string,
    name: string,
    username: string,
    imageUrl: string,
    cardType: string
}

export default function UserCard({id, name, username, imageUrl, cardType}: UserCardProps) {

    const router = useRouter()

  return (
    <article className='user-card'>
        <div className="user-card_avatar items-center">
            <div className='relative h-16 w-16'>
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

            <Button 
            className='user-card_btn'
            onClick={() => router.push(`/profile/${id}`)}>Ver</Button>
        </div>
    </article>
  )
}
