import ProfileHeader from "@/components/shared/ProfileHeader"
import { fetchUser } from "@/lib/actions/user.actions"
import { currentUser } from "@clerk/nextjs"
import { redirect } from "next/navigation"
import { profileTabs } from "@/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import ThreadTab from "@/components/shared/ThreadTab"


export default async function Page({ params }: { params: {id: string}}) {

    const user = await currentUser()

    if(!user) return

    const userInfo = await fetchUser(params.id)

    if (!userInfo.onboarded) redirect('/onboarding')

    return (
        <section>
            <ProfileHeader 
                profileId={userInfo.id}
                loggedId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                image={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((tab) => (
                            <TabsTrigger 
                            key={tab.label}
                            value={tab.value}
                            className="tab cursor-pointer "
                            >
                                <Image 
                                src={tab.icon}
                                alt={tab.label}
                                width={24}
                                height={24}
                                className="object-contain"
                                />
                                <p className="max-sm:hidden">{tab.label}</p>
                                {tab.label === 'Threads' && (
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{userInfo?.threads?.length}</p>
                                    )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    {profileTabs.map((tabs) => (
                        <TabsContent 
                        key={tabs.label} 
                        value={tabs.value}
                        className="w-full text-light-1"
                        >
                            <ThreadTab 
                            currentUserId={user.id}
                            accountId={userInfo.id}
                            accountType='User'
                            />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </section>
    )
}