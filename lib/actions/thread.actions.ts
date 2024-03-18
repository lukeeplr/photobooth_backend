'use server'

import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import Community from "../models/community.model"
import { connectToDB } from "../mongoose"

type createThreadParams = {
    author: string,
    thread: string
    community: string | null
    path: string
}

type addCommentParams = {
    threadId: string,
    thread: string,
    userId: string,
    path: string
}

export async function createThread({author, thread, community, path}: createThreadParams) {

    try {

        connectToDB()

        const communityObjectId = await Community.findOne({id: community}, {_id: 1})

        const createdThread = await Thread.create({
            author,
            thread,
            community: communityObjectId
        })

        await User.findByIdAndUpdate(author, {
        $push: {threads: createdThread._id}
        })

        if (communityObjectId) {
            await Community.findByIdAndUpdate(communityObjectId, {
                $push: {threads: createdThread._id}
            })
        }

    revalidatePath(path)

    } catch (error: any) {
        throw new Error(`Falha ao criar a thread: ${error.message}`)
    }

    
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
        .populate({path: 'community', model: Community})
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: User,
                select: '_id name parentId username image'
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


export async function fetchThreadById(id: string) {
    
    try {
        connectToDB() 
        const thread = await Thread.findById(id)
        .populate({
            path: 'author',
            model: User,
            select: '_id id name username image'
        })
        .populate({
            path: 'children',
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: '_id id name username image parentId'
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',	
                        model: User,
                        select: '_id id name username parentId image'
                    }
                }
            ]
        }).exec()

    return thread

    } catch (error: any) {
        throw Error(`Falha ao buscar a thread: ${error.message}`)
    }
    
}


export async function addComment({threadId, thread, userId, path}: addCommentParams) {

    try {
        connectToDB()
        const originalThread = await Thread.findById(threadId)

        if (!originalThread) {
            throw new Error('Thread não encontrada')
        }

        const reply = new Thread({
            thread,
            author: userId,
            parentId: threadId
        })

        const savedReply = await reply.save()
        originalThread.children.push(savedReply._id)

        await originalThread.save()

        revalidatePath(path)

    } catch (error: any) {
        throw Error(`Falha ao adicionar o comentário: ${error.message}`)
    }

}