import { fetchUserPosts } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import React from 'react'
import ThreadCard from '../cards/ThreadCard'

type ThreadTypeProps = {
    currentUserId: string
    accountId: string
    accountType: string
}

export default async function ThreadTab({currentUserId, accountId, accountType}: ThreadTypeProps) {
  
  let result = await fetchUserPosts(accountId)

  if(!result) redirect('/')
  
  return (

    <section className='mt-9 flex flex-col gap-10'>
        {result.threads.map((thread: any) => (
          <ThreadCard 
          key={thread._id}
          id={thread._id}
          currentUser={currentUserId}
          parentId={thread.parentId}
          content={thread.thread}
          author={
            accountType === 'User'
              ? { name: result.name, username: result.username, image: result.image, id: result.id}
              : { name: thread.author.name, username: thread.author.username, image: thread.author.image, id: thread.author.id}
        }
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          />
        ))}
    </section>
  )
}
