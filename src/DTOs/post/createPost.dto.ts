import z from 'zod'

export interface CreatePostInputDTO{
    content: string,
    token: string
}

export type CreatePostOutputDTO = undefined

export const CreatePostSchema = z.object({
    content: z.string().min(10),
    token: z.string()
}).transform(data=> data as CreatePostInputDTO)