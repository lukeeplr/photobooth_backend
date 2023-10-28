import { currentUser } from '@clerk/nextjs'

import AccountProfile from '@/components/forms/AccountProfile'
import { fetchUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'

async function Page() {

    const user = await currentUser()
    if (!user) return

    const userInfo = await fetchUser(user.id)
    if(userInfo?.onboarded) redirect('/onboarding')

    const userData = {
        id: user?.id,
        objectId: userInfo?._id,
        username: userInfo? userInfo?.username : user?.username,
        name: userInfo? userInfo?.name : user?.firstName || "",
        bio: userInfo? userInfo?.bio : "",
        image: userInfo? userInfo?.image : user?.imageUrl
    }

    return (
        <main className="flex flex-col justify-center mx-auto max-w-3xl px-10 py-20">
            <h1 className="head-text">Detalhes</h1>
            <p className="text-light-2 text-base-regular mt-3">Adicione mais alguma informações para poder usar o Threads</p>

            <section className="mt-9 bg-dark-2 p-10">
                <AccountProfile user={userData} btnTitle={'Continuar'}/>
            </section>
        </main>
    )
}

export default Page