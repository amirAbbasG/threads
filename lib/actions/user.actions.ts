"use server"

import {revalidatePath} from "next/cache";

import {FilterQuery, SortOrder} from "mongoose";

import {connectToDB} from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import Thread from "@/lib/models/thread.model";

interface UserInput {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string;
}

export async function updateUser({userId, ...rest}: UserInput, path: string) {
    await connectToDB()

    try {
        await User.findOneAndUpdate(
            {id: userId},
            {
                ...rest,
                username: rest.username,
                onboarded: true
            },
            {upsert: true}
        )
        if (path === "/profile/edit") {
            revalidatePath(path)
        }

    } catch (e: any) {
        throw new Error(`failed to create/update user: ${e.message}`)
    }
}

export async function fetchUser(userId: string) {
    await connectToDB()

    try {
        return await User.findOne({
            id: userId
        })

    } catch (e: any) {
        throw new Error(`failed to fetch user: ${e.message}`)
    }
}

interface FetchUsersInput {
    userId: string,
    searchString?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}

export async function fetchAllUsers({
                                        userId,
                                        sortBy = "desc",
                                        searchString = "",
                                        pageSize = 20,
                                        pageNumber = 1
                                    }: FetchUsersInput) {
    await connectToDB()

    try {
        const skipAmount = (pageNumber - 1) * pageSize
        const regexp = new RegExp(searchString, "i")

        const query: FilterQuery<typeof User> = {
            id: {$ne: userId},
        }

        if (searchString?.trim() !== "") {
            query.$or = [
                {username: {$regexp: regexp}},
                {name: {$regexp: regexp}}
            ]
        }

        const sortOption = {createdAt: sortBy}

        const users = await User.find(query)
            .sort(sortOption)
            .skip(skipAmount)
            .limit(pageSize)

        const totalCount = await User.countDocuments(query)

        const isNext = totalCount > skipAmount + pageSize

        return {users, isNext}

    } catch (e: any) {
        throw new Error(`failed to fetch user: ${e.message}`)
    }
}

export async function getActivity(userId: string) {
    await connectToDB()

    try {
        const userThreads = await Thread.find({author: userId})

        const childThreadIds = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children);
        }, []);


        return await Thread.find({
            _id: {$in: childThreadIds},
            author: {$ne: userId}
        })
            .populate({
                path: "author",
                model: User,
                select: "name image _id",
            });

    } catch (e: any) {
        throw new Error(`failed to fetch activity: ${e.message}`)
    }
}