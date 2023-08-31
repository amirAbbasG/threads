import React, {FC} from 'react';
import {fetchUserThreads} from "@/lib/actions/threads.actions";
import {redirect} from "next/navigation";
import ThreadCard from "@components/cards/ThreadCard";

interface Props {
    currentUserId: string
    accountId: string
    accountType: string
}

const ThreadsTab: FC<Props> = async ({currentUserId, accountType, accountId}) => {
    const result = await fetchUserThreads(accountId)

    if (!result) redirect("/")

    return (
        <section className="flex flex-col mt-9 gap-10">
            {result.threads.map((thread: any) => (
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={currentUserId}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={
                        accountType === "User"
                            ? { name: result.name, image: result.image, id: result.id }
                            : {
                                name: thread.author.name,
                                image: thread.author.image,
                                id: thread.author.id,
                            }
                    }
                    community={
                        accountType === "Community"
                            ? { name: result.name, id: result.id, image: result.image }
                            : thread.community
                    }
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            ))}
        </section>
    );
};

export default ThreadsTab;