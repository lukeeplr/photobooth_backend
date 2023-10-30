import React from 'react'
import { currentUser } from '@clerk/nextjs'
import { fetchUsers, fetchUser } from '@/lib/actions/user.actions'
import { fetchCommunities } from '@/lib/actions/community.actions'
import SuggestionCard from '../cards/SuggestionCard'

export default async function RightBar() {

  const user = await currentUser()
  if (!user) return null

  const suggestedUsers = await fetchUsers({
    userId: user.id,
    pageNumber: 1,
    pageSize: 3
  })

  const suggestedCommunities = await fetchCommunities({
    pageNumber: 1,
    pageSize: 3,
  })


  return (
    <section className='custom-scrollbar rightsidebar'>
      <div className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1 mb-6'>Comunidades sugeridas</h3>
        <div className='flex flex-col gap-3'>
          {suggestedCommunities.communities.map((communities: any) => (
            <>
              <SuggestionCard
                id={communities.id}
                name={communities.name}
                username={communities.username}
                imageUrl={communities.image}
                suggestionType='communities'
              />
            </>
          ))}
          </div>
      </div>
      <section className='flex flex-1 flex-col justify-start'>
        <h3 className='text-heading4-medium text-light-1 mb-6'>Usuários sugeridos</h3>
          <div className='flex flex-col gap-3'>
          {suggestedUsers.users.map((user: any) => (
            <>
              <SuggestionCard
                id={user.id}
                name={user.name}
                username={user.username}
                imageUrl={user.image}
                suggestionType='profile'
              />
            </>
          ))}
          </div>

      </section>
    </section>
  )
}
