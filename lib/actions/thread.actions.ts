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