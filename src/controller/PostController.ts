import { ZodError } from 'zod';
import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../DTOs/post/createPost.dto";
import { BaseError } from "../errors/BaseError";
import { GetPostInputDTO, GetPostOutputDTO, GetPostSchema } from '../DTOs/post/getPost.dto';
import { EditPostSchema } from '../DTOs/post/editPost.dto';
import { DeletePosSchema } from '../DTOs/post/deletePost.dto';
import { LikeOrDislikePostSchema } from '../DTOs/post/likeOrDislikePost.dto';

export class PostController {
  constructor(private postBusiness: PostBusiness) {}

  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization as string
      });

      const result = await this.postBusiness.createPost(input);

      res.status(201).send(result);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  }

  public getPost = async (req: Request, res: Response) => {
    try {
      const input: GetPostSInputDTO = {
        token: req.headers.authorization as string
      };

      const output: GetPostSOutputDTO = await this.postBusiness.getPost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  }

  public editPost = async (req: Request, res: Response) => {
    try {
      const input = EditPostSchema.parse({
        token: req.headers.authorization as string,
        idToEdit: req.params.id,
        content: req.body.content
      });

      const output = this.postBusiness.editPost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  }

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePosSchema.parse({
        token: req.headers.authorization as string,
        idToDelete: req.params.id
      });

      const output = await this.postBusiness.deletePost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  }

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikePostSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization as string,
        like: req.body.like
      });

      const output = this.postBusiness.likeOrDislikePost(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  }
}
