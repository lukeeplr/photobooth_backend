import CommunityCard from "@/components/cards/CommunityCard"
import UserCard from "@/components/cards/UserCard"
import { fetchCommunities } from "@/lib/actions/community.actions"
import { fetchUser } from "@/lib/actions/user.actions"
import Community from "@/lib/models/community.model"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"


export default async function Page() {

    const user = await currentUser()

    if(!user) return

    const userInfo = await fetchUser(user.id)

    if (!userInfo.onboarded) redirect('/onboarding')

    const result = await fetchCommunities({
      searchString: '',
      pageNumber: 1,
      pageSize: 25,
      sortBy: 'desc'
    })


  return (
    <section>
        <h1 className="head-text mb-10">Busca</h1>
        <div className="mt-14 flex flex-col gap-9">
          {result?.communities.length === 0 
          ? <p className="no-result">Nenhuma comunidade encontrada</p>
          : (
            <>
              {result?.communities.map((community) => (
                <CommunityCard 
                key={community.id}
                id={community.id}
                name={community.name}
                username={community.username}
                imgUrl={community.image}
                bio={community.bio}
                members={community.members}  
                />
              ))}
            </>
          )
          }
        </div>
    </section>
  )
}
