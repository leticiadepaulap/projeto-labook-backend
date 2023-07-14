import z from 'zod';
import { UserModel } from './types';
export interface SignupInputDTO {
    name: string,
    email: string,
    password: string
}

export interface SignupOutDTO {
    token: string
}


export const SignupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(4)
}).transform(data=> data as SignupInputDTO)


