// import { UserButton } from "@clerk/nextjs";

import ThreadCard from "@/components/cards/ThreadCard"
import { fetchThreads } from "@/lib/actions/thread.actions"
import { currentUser } from "@clerk/nextjs"

export default async function Home() {
  
  const user = await currentUser()
  const result = await fetchThreads(1, 20)

  return (
    <>
    <h1 className="head-text">Início</h1>
    <section className="mt-9 flex flex-col gap-10">
      {result.threads.length === 0 
      ? <p className="no-result">Nada pra ver agora...</p>     
      : result.threads.map((thread) => {
        return (
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
        )        
      }) 
    }
    </section>
    </>
  )
}

