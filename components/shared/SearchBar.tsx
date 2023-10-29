'use client'

import React, { useEffect, useState } from 'react'
import { Input } from "@/components/ui/input"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function SearchBar({ searchWhere }: { searchWhere: string }) {
    
    const [search, setSearch] = useState('')
    const router = useRouter()

    useEffect(() => {
        const delayedSearch = setTimeout(() => {
            search
            ? router.push(`/${searchWhere}?q=` + search)
            : router.push(`/${searchWhere}`)
        }, 300)

        return () => {
            clearTimeout(delayedSearch)
        }
    }, [search, searchWhere])


  return (
    <div className='searchbar'>
        <Image 
        src='/assets/search.svg' 
        alt='busca' 
        width={24} 
        height={24}
        className='object-contain'
        />
        <Input 
            id='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={ searchWhere === 'communities' ?  'Busque por comunidades...' : 'Busque por usuários...'}
            className='no-focus searchbar_input'
        />
    </div>
  )
}
