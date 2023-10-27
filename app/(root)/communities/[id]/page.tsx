import ProfileHeader from "@/components/shared/ProfileHeader"
import { currentUser } from "@clerk/nextjs"
import { communityTabs } from "@/constants"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Image from "next/image"
import ThreadTab from "@/components/shared/ThreadTab"
import { fetchCommunityInfo } from "@/lib/actions/community.actions"
import UserCard from "@/components/cards/UserCard"


export default async function Page({ params }: { params: {id: string}}) {

    const user = await currentUser()
    if(!user) return

    const communityDetails = await fetchCommunityInfo(params.id)

    return (
        <section>
            <ProfileHeader 
                profileId={communityDetails.id}
                loggedId={user.id}
                name={communityDetails.name}
                username={communityDetails.username}
                image={communityDetails.image}
                bio={communityDetails.bio}
            />

            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {communityTabs.map((tab) => (
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
                                    <p className="ml-1 rounded-sm bg-light-4 px-2 py-1 !text-tiny-medium text-light-2">{communityDetails?.threads?.length}</p>
                                    )}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                        <TabsContent 
                        value='threads'
                        className="w-full text-light-1"
                        >
                          <ThreadTab 
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType='Community'
                            />
                        </TabsContent>

                        <TabsContent 
                        value='membros'
                        className="w-full text-light-1"
                        >
                            <section>
                                  {communityDetails?.members.map((member: any) => (
                                    <UserCard 
                                     key={member._id}
                                     id={member._id}
                                     name={member.name}
                                     username={member.username}
                                     imageUrl={member.image}
                                     cardType="User"
                                     /> 
                                  ))}
                            </section>
                        </TabsContent>

                        <TabsContent 
                        value='requests'
                        className="w-full text-light-1"
                        >
                            <ThreadTab 
                            currentUserId={user.id}
                            accountId={communityDetails._id}
                            accountType='Community'
                            />
                        </TabsContent>
                </Tabs>
            </div>
        </section>
    )
}