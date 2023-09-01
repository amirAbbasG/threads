"use server"
import {revalidatePath} from "next/cache";

import {connectToDB} from "@/lib/mongoose";
import Thread from "@/lib/models/thread.model";
import User from "@/lib/models/user.model";
import Community from "@/lib/models/community.model";

interface CreateThreadInput {
    text: string,
    author: string,
    communityId: string | null,
    path: string,
}

interface CommentToThreadInput {
    commentText: string,
    userId: string,
    threadId: string,
    path: string,
}

export async function createThread({text, author, communityId, path}: CreateThreadInput) {
    await connectToDB()

    try {
        const communityIdObject = await Community.findOne(
            {id: communityId},
            {_id: 1}
        );


        const thread = await Thread.create({
            text,
            author,
            community: communityIdObject
        })

        if (communityIdObject) {
            await Community.findByIdAndUpdate(communityIdObject, {
                $push: {threads: thread._id}
            })
        }

        await User.findByIdAndUpdate(author, {
            $push: {threads: thread._id}
        })

        revalidatePath(path)
    } catch (e: any) {
        throw new Error(`Failed to create thread: ${e.message}`);
    }
}

export async function fetchPosts(pageNumber: number = 1, pageSize: number = 20) {
    await connectToDB()

    try {
        const skipCount = (pageNumber - 1) * pageSize
        const postQuery = Thread.find({parentId: {$in: [null, undefined]}})
            .sort({createdAt: "desc"})
            .skip(skipCount)
            .limit(pageSize)
            .populate({path: "author", model: User})
            .populate({
                path: "children",
                populate: {
                    path: "author",
                    model: User,
                    select: "_id id parentId name image"
                }
            })
            .populate({
                path: "community",
                model: Community,
            })


        const totalCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})
        const posts = await postQuery.exec()

        const isNext = totalCount > posts.length + pageSize

        return {posts, isNext}

    } catch (e: any) {
        throw new Error(`Failed to fetch posts: ${e.message}`);
    }
}

export async function fetchThreadById(threadId: string) {
    await connectToDB()

    try {
        const authorPopulate = {
            path: "author",
            model: User,
            select: "_id id parentId name image"
        }

        return Thread.findById(threadId)
            .populate(authorPopulate)
            .populate({
                path: "children",
                populate: [
                    authorPopulate,
                    {
                        path: "children",
                        model: Thread,
                        populate: authorPopulate
                    }
                ]
            })
            .populate({
                path: "community",
                model: Community,
                select: "_id id name image",
            })

    } catch (e: any) {
        throw new Error(`Failed to fetch thread with id ${threadId}: ${e.message}`);
    }
}

export async function addCommentToThread({commentText, userId, threadId, path}: CommentToThreadInput) {
    await connectToDB()

    try {
        const commentThread = await Thread.create({
            text: commentText,
            author: userId,
            parentId: threadId
        })

        await Thread.findByIdAndUpdate(threadId, {
            $push: {children: commentThread._id}
        })

        revalidatePath(path)
    } catch (e: any) {
        throw new Error(`Failed to add comment to  thread with id ${threadId}: ${e.message}`);
    }
}

export async function fetchUserThreads(userId: string) {
    await connectToDB()

    try {
        return await User.findOne({id: userId})
            .populate({
                path: "threads",
                model: Thread,
                populate: [
                    {
                        path: "community",
                        model: Community,
                        select: "name id image _id", // Select the "name" and "_id" fields from the "Community" model
                    },
                    {
                        path: "children",
                        model: Thread,
                        populate: {
                            path: "author",
                            model: User,
                            select: "name image id"
                        }
                    }]
            })
    } catch (e: any) {
        throw new Error(`Failed to fetch user threads: ${e.message}`);
    }
}