import * as z from "zod"

export const UserValidation = z.object({
    profile_photo: z.string().url().min(1),

    name: z.string().min(2, {message: 'Seu nome deve ter pelo menos 2 caracteres'}).max(30, {message: 'Seu nome deve ter no máximo 30 caracteres'}),

    username: z.string().min(5, {message: 'Seu nome de usuário precisa ter pelo menos 5 caracteres'}).max(24, {message: 'Seu nome de usuário deve ter no máximo 24 caracteres'}),

    bio: z.string().min(1, {message: 'Sua bio deve ter pelos 1 caractere'}).max(1000, {message: 'Sua bio deve ter no máximo 1000 caracteres'})
})