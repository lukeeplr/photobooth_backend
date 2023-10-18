import React from 'react'
import ThreadCard from '@/components/cards/ThreadCard'
import { currentUser } from '@clerk/nextjs'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { fetchThreadById } from '@/lib/actions/thread.actions'
import Comment from '@/components/forms/Comment'

export default async function Page({params}: { params: {id: string}}) {

  if(!params.id) return null

  const user = await currentUser()
  if(!user) return null

  const userInfo = await fetchUser(user.id)
  if (!userInfo?.onboarded) redirect('/onboarding')

  const thread = await fetchThreadById(params.id)

  return (
    <section className="relative">
      <div>
      <ThreadCard 
          key={thread._id}
          id={thread._id}
          currentUser={user?.id || ''}
          parentId={thread.parentId}
          content={thread.thread}
          author={thread.author}
          community={thread.community}
          createdAt={thread.createdAt}
          comments={thread.children}
          />
      </div>

      <div className="mt-7">
        <Comment 
        threadId={thread.id}
        currentUserId={JSON.stringify(userInfo._id)}
        currentUserImage={userInfo.image}
        />
      </div>

      <div className='mt-10'>
        {thread.children.map((reply: any) => (
          <ThreadCard 
          key={reply._id}
          id={reply._id}
          currentUser={user?.id || ''}
          parentId={reply.parentId}
          content={reply.thread}
          author={reply.author}
          community={reply.community}
          createdAt={reply.createdAt}
          comments={reply.children}
          isComment
          />
        ))}
      </div>


    </section>
  )
}
