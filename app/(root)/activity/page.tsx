import { fetchActivity, fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"


export default async function Page() {

    const user = await currentUser()

    if(!user) return

    const userInfo = await fetchUser(user.id)

    if (!userInfo.onboarded) redirect('/onboarding')

    const results = await fetchActivity(userInfo._id)

  return (
    <section>
        <h1 className="head-text mb-10">Atividade</h1>

        <section className="mt-10 flex flex-col gap-5">
          {results.length > 0
          ? (
            <>
            {results.map((activity) => (
              <Link key={activity._id} href={`/thread/${activity.parentId}`}>
                <article className="activity-card gap-5">
                  <Image
                  src={activity.author.image}
                  alt={`foto de perfil de @${activity.author.username}`} 
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                  />
                  <p className="!text-base-regular text-light-2/80 ">
                    <span className="text-base-semibold text-light-1">
                      {activity.author.name}</span> {" "}respondeu sua Thread
                  </p>
                </article>
              </Link>
            ))}
            </>
          )
          : (
            <p className="text-left no-result">Nenhuma atividade encontrada</p>
          )
        }
        </section>
    </section>
  )
}
