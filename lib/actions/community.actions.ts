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

        const community = await Community.findOne({ id: communityId })
        if (!community) {
            throw new Error('Comunidade não encontrada')
        }

        const user = await User.findOne({ id: userId })
        if (!user) {
            throw new Error('Usuário não encontrado')
        }

        if (!community.members.includes(user._id)) {
            throw new Error('Usuário já pertence a comunidade')
        }

    } catch (error: any) {
        throw new Error(`Falha ao remover o membro da comunidade: ${error.message}`)
    }
}


export async function createCommunity() {
    try {

        connectToDB()

    } catch (error: any) {
        throw new Error(`Falha ao criar a comunidade: ${error.message}`)
    }
} 


export async function deleteCommunity() {
    try {

        connectToDB()

    } catch (error: any) {
        throw new Error(`Falha ao deletar a comunidade: ${error.message}`)
    }
}


export async function updateCommunityInfo() {
    try {

        connectToDB()

    } catch (error: any) {
        throw new Error(`Falha ao atualizar a comunidade: ${error.message}`)
    }
}