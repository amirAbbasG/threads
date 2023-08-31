import React from 'react';

import {redirect} from "next/navigation";

import {currentUser} from "@clerk/nextjs";

import {fetchUser} from "@/lib/actions/user.actions";
import {PostThread} from "@components/forms";

const CreateThread = async () => {
    const user = await currentUser()

    if (!user) return null

    const userInfo = await fetchUser(user.id)

    if (!userInfo?.onboarded) redirect("/onboarding")

    return (
        <>
            <h1 className="head-text">Create Thread</h1>

            <PostThread userId={userInfo?._id || ""}/>
        </>
    );
};

export default CreateThread;