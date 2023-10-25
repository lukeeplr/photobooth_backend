'use server'

import { connectToDB } from "../mongoose"
import { FilterQuery, SortOrder } from "mongoose"

import Community from "../models/community.model"
import User from "../models/user.model"
import Thread from "../models/thread.model"

export async function addMemberToCommunity(userId: string, communityId: string) {
    
    try {

        connectToDB()

        const community = await Community.findOne({ id: communityId })
        if (!community) {
            throw new Error('Comunidade não encontrada')
        }

        const user = await User.findOne({ id: userId })
        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        if (community.members.includes(user._id)) {
            throw new Error('Usuário já pertence a comunidade')
        }

        community.members.push(user._id)
        await community.save()

        user.communities.push(community._id)
        await user.save()

        return community 

    } catch (error: any) {
        throw new Error(`Falha ao adicionar o membro à comunidade: ${error.message}`)
    }

}


export async function removeUserFromCommunity(userId: string, communityId: string) {

    try { 

        connectToDB()

        const community = await Community.findOne({ id: communityId }, { _id: 1 })
        if (!community) {
            throw new Error('Comunidade não encontrada')
        }

        const user = await User.findOne({ id: userId }, { _id: 1 })
        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        if (!community.members.includes(user._id)) {
            throw new Error('Usuário não pertence à comunidade')
        }

        await Community.updateOne(
            { _id: community._id },
            { $pull: { members: user._id } }
        )

        await User.updateOne(
            { _id: user._id },
            { $pull: { communities: community._id } }
        )

        return {sucess: true}

    } catch (error: any) {
        throw new Error(`Falha ao remover o membro da comunidade: ${error.message}`)
    }
}


export async function createCommunity(
    id: string, 
    name: string,
    username: string,
    image: string, 
    bio: string, 
    createdBy: string
    ) {
    try {

        connectToDB()

        const user = await User.findOne({ id: createdBy })
        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        const newCommmunity = new Community({
            id,
            name,
            username,
            image,
            bio,
            createdBy: user._id
        })

        const createdCommunity = await newCommmunity.save()

        user.communities.push(createdCommunity._id)
        await user.save()

        return createdCommunity

    } catch (error: any) {
        throw new Error(`Falha ao criar a comunidade: ${error.message}`)
    }
} 


export async function deleteCommunity(communityId: string) {
    try {

        connectToDB()

        const deletedCommunity = await Community.findOneAndDelete({ id: communityId })

        if (!deletedCommunity) {
            throw new Error('Comunidade não encontrada')
        }

        await Thread.deleteMany({ community: communityId })

        const members = await User.find({ communities: communityId })

        const updateUserPromises = members.map((users) => {
            users.communities.pull(communityId)
            return users.save()
        })

        await Promise.all(updateUserPromises)

        return deletedCommunity

    } catch (error: any) {
        throw new Error(`Falha ao deletar a comunidade: ${error.message}`)
    }
}


export async function updateCommunityInfo(id: string, name: string, username: string, image: string) {
    try {

        connectToDB()
        const updatedCommunity = await Community.findOneAndUpdate(
            { id },
            { name, username, image }
        )

            if (!updatedCommunity) {
                throw new Error('Comunidade não encontrada')
            }

        return updatedCommunity

    } catch (error: any) {
        throw new Error(`Falha ao atualizar a comunidade: ${error.message}`)
    }
}


export async function fetchCommunityInfo(id:string) {
    
    try {

        connectToDB()

        const communityDetails = await Community.findOne({ id: id })
        .populate([
            'createdBy',
            {
                path: 'members',
                model: User,
                select: '_id id name username image'
            }
        ])

        return communityDetails

    } catch (error: any) {
        throw new Error(`Falha ao encontrar a comunidade: ${error.message}`)
    }


}


export async function fetchCommunityPosts(id: string) {

    try {

        connectToDB()

        const communityPosts = await Community.findById(id)
        .populate({
            path: 'threads',
            model: Thread,
            populate: [
                {
                    path: 'author',
                    model: User,
                    select: '_id id name username image'
                },
                {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select: '_id image'
                    }
                }
            ]
        })
    
        return communityPosts

    } catch (error: any) {
        throw new Error(`Falha ao encontrar os posts da comunidade: ${error.message}`)
    }

}
    
