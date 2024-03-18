'use server'

import { revalidatePath } from "next/cache"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import Thread from "../models/thread.model"
import { FilterQuery, SortOrder } from "mongoose"
import { redirect, useRouter } from "next/navigation"

type updateUserParams = {
    userId: string,
    username: string,
    name: string,
    bio: string,
    image: string,
    path: string
}


type fetchUsersParams = {
    userId: string,
    searchTerm?: string,
    pageNumber?: number,
    pageSize?: number,
    sortBy?: SortOrder
}


type likeThreadParams = {
    userId: string,
    threadId: string
}

type wasLikedParams = {
    userId: string,
    threadId: string
}


export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: updateUserParams
    ): Promise<void> {
        
        try {
            
        connectToDB()
        await User.findOneAndUpdate(
            {id: userId}, 
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true
        },
        { upsert: true}
        )
    
        if (path === '/profile/edit') {
            revalidatePath(path)
        }

    } catch (error: any) {
        throw Error(`Falha ao criar/atualizar o usuário: ${error.message}`)
    }
}


export async function fetchUser(userId: string) {
    
    try {

        connectToDB()
       return await User.findOne({id: userId})

    } catch (error: any) {
        throw Error(`Falha ao encontrar o usuário: ${error.message}`)
    }
}


export async function fetchUserPosts(userId: string) {
    try {

        connectToDB()

        const posts = await User.findOne({id: userId})
        .populate({
            path: 'threads',
            model: Thread,
            populate: {
                path: 'children',
                model: Thread,
                populate: {
                    path: 'author',
                    model: User,
                    select: 'name image id'
                }
            } 
        })

        return posts

    } catch (error: any) {
        throw Error(`Falha ao encontrar os posts do usuário: ${error.message}`)
    }
}


export async function fetchUsers({
    userId,
    searchTerm = '',
    pageNumber = 1,
    pageSize = 20,
    sortBy = 'desc' 

}: fetchUsersParams) {
    
    try {
        connectToDB()

        const skipAmout = ((pageNumber - 1) * pageSize)
        
        const regex = new RegExp(searchTerm, 'i')

        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if(searchTerm.trim() !== '') {
            query.$or = [
                { username: { $regex: regex}},
                { name: { $regex: regex}}
            ]
        }

        const sortOptions = { createdAt: sortBy}

        const usersQuery = User.find(query) 
            .sort(sortOptions)
            .skip(skipAmout)
            .limit(pageSize)
    

        const totalUsersCount = await User.countDocuments(query)

        const users = await usersQuery.exec()

        const isNext = totalUsersCount > skipAmout + users.length

        return { users, isNext}

    } catch (error: any) {
        throw new Error(`Falha ao buscar usuários: ${error.message}`)
    } 
}


export async function fetchActivity(userId: string) {

    try {

        connectToDB()
        const userThreads = await Thread.find({ author: userId })

        const childThreadsId = userThreads.reduce((acc, userThread) => {
            return acc.concat(userThread.children)
        }, [])

        const replies = await Thread.find({
             _id: { $in: childThreadsId },
            author: { $ne: userId }}
        ).populate({ 
            path: 'author', 
            model: User,
            select: '_id name image'})

        return replies

    } catch (error: any) {
        throw new Error(`Falha ao buscar notificações: ${error.message}`)
    }
} 


export async function likeThread({userId, threadId}: likeThreadParams) {

    try {
        connectToDB()
        const user = await User.findOne({id: userId})
        const thread = await Thread.findOne({_id: threadId})

        if (!user || !thread) {
            throw new Error('Usuário ou Thread inexistentes')            
        }

        let liked = thread.likedBy.includes(user._id)

        console.log(thread)

        if (liked) {
            thread.likedBy.pull(user._id)
            user.likedThreads.pull(thread._id)
        } else {
            thread.likedBy.push(user._id)
            user.likedThreads.push(thread._id)
        }

        await thread.save()
        await user.save()
        revalidatePath(`/thread/${threadId}`)
        revalidatePath(`/`)    

    } catch (error: any) {
        throw new Error(`Falha ao curtir a Thread: ${error.message}`)
    }

}


export async function wasLiked({userId, threadId}: wasLikedParams) {

    try {

        connectToDB()

        const user = await User.findOne({id: userId})
        const thread = await Thread.findOne({_id: threadId}) 

        if (!user || !thread) {
            return false            
        }

        return (thread.likedBy.includes(user._id))


    } catch(error: any) {
        throw new Error(`Falha ao verificar se o usuário curtiu a Thread: ${error.message}`)
    }

}