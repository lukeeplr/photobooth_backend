'use server'

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"

type createThreadParams = {
    author: string,
    thread: string
    community: string | null
    path: string
}

export async function createThread({author, thread, community, path}: createThreadParams) {
    connectToDB()

    const createdThread = await Thread.create({
        author,
        thread,
        community: null
    })

    await User.findByIdAndUpdate(author, {
        $push: {threads: createdThread._id}
    })

    revalidatePath(path)
}


export async function fetchThreads(pageNumber = 1, pageSize = 20) {
    try {
        connectToDB()

        const skipAmout = ((pageNumber - 1) * pageSize)

        const threadsQuery = Thread.find({ parentId: {$in: [null, undefined]}})
        .sort({ createdAt: 'desc'})
        .skip(skipAmout)
        .limit(pageSize)
        .populate({path: 'author', model: User})
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId image'
            }
            
        })

        const totalThreadsCount = await Thread.countDocuments({parentId: {$in: [null, undefined]}})
        const threads = await threadsQuery.exec() 
        const isNext = totalThreadsCount > skipAmout + threads.length

        return { threads, isNext}


    } catch (error: any) {
        throw Error(`Falha ao buscar as threads: ${error.message}`)
    }
}