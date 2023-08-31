import React from 'react';

import Image from "next/image";
import {redirect} from "next/navigation";

import {currentUser} from "@clerk/nextjs";

import {fetchUser} from "@/lib/actions/user.actions";
import {ProfileHeader, ThreadsTab} from "@components/shared";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@components/ui/tabs";
import {profileTabs} from "@/constants";

const UserProfile = async ({params}: {params: {id: string}}) => {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(params.id)

    if (!userInfo?.onboarded) redirect("/onboarding")

    return (
        <>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className="mt-9">
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {
                            profileTabs.map(tab => (
                                <TabsTrigger value={tab.value} key={tab.label} className="tab">
                                    <Image src={tab.icon} alt={tab.label} width={24} height={24} className="object-contain"/>
                                    <p className="max-sm:hidden">{tab.label}</p>
                                    {
                                        tab.label === "Threads" && (
                                            <p className="ml-1 rounded-sm px-2 py-1 bg-light-4 !text-tiny-medium text-light-1">
                                                {userInfo?.threads?.length}
                                            </p>
                                        )
                                    }
                                </TabsTrigger>
                            ))
                        }
                    </TabsList>
                    {
                        profileTabs.map(tab => (
                            <TabsContent value={tab.value} key={`content-${tab.label}`} className="w-full text-light-1">
                                {/* @ts-ignore */}
                                <ThreadsTab
                                    currentUserId={user.id}
                                    accountId={userInfo.id}
                                    accountType='User'
                                />
                            </TabsContent>
                        ))
                    }
                </Tabs>
            </div>
        </>
    );
};

export default UserProfile;