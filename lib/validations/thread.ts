import * as z from 'zod'

export const ThreadValidation = z.object({
    thread: z.string().min(1, {message: 'Escreva alguma coisa...'}).max(144, {message: 'Uma Thread pode ter no máximo 144 caracteres'}),
    author: z.string()
})


export const CommentValidation = z.object({
    thread: z.string().min(1, {message: 'Escreva alguma coisa...'}).max(144, {message: 'Uma Thread pode ter no máximo 144 caracteres'}),
    author: z.string()
})