import z from 'zod'

export interface EditPostInputDTO{
    content: string,
    token: string,
    idToEdit: string,
}

export type EditPostOutputDTO = undefined

export const EditPostSchema = z.object({
    token: z.string().min(1),
    idToEdit: z.string().min(1),
    content: z.string().min(10),
}).transform(data => data as EditPostInputDTO )