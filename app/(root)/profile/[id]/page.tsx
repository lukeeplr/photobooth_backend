import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import Image from "next/image"

export default async function Page({ params }: { params: {id: string}}) {

    const user = currentUser()

    if(!user) return

    const userInfo = await fetchUser(params.id)

    return (
        <section>
            <h1 className="head-text">Editar perfil</h1>
            <div className="mt-10">
            <Image 
            src={userInfo.image} 
            alt='foto de perfil' 
            width={100} 
            height={100}
            className="rounded-full object-cover"
            />
            </div>
        </section>
    )
}