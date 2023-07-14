import { PostDatabase } from "../database/PostDatabase";
import {  CreatePostInputDTO,  CreatePostOutputDTO,} from "../DTOs/post/createPost.dto";
import {  DeletePostInputDTO,  DeletePostOutputDTO,} from "../DTOs/post/deletePost.dto";
import {  EditPostInputDTO,  EditPostOutputDTO,} from "../DTOs/post/editPost.dto";
import { GetPostInputDTO, GetPostOutputDTO } from "../DTOs/post/getPost.dto";
import {  LikeOrDislikePostSchema,  LikeOrDislikePostOutputDTO,} from "../DTOs/post/likeOrDislikePOst.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {  Post,  PostDBWithCreatorName,  LikeDislikeDB,  POST_LIKE,} from "../models/Post";
import { USER_ROLES } from "../models/User";
import { TokenManager } from "../services/TokenManager";
import { IdGenerator } from "../services/idGenerator";


export class PostBusiness {
    constructor(
      private postDatabase: PostDatabase,
      private idGenerator: IdGenerator,
      private tokenManager: TokenManager
    ) {}
  
    public createPost = async (
      input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO> => {
      const { content, token } = input;
  
      const payload = this.tokenManager.getPayload(token);
  
      if (!payload) {
        throw new UnauthorizedError();
      }
  
      const id = this.idGenerator.generate();
  
      const post = new Post(
        id,
        payload.id,
        content,
        0,
        0,
        new Date().toISOString(),
        new Date().toISOString(),
        payload.name
      );
      const postDB = post.toDBModel();
      await this.postDatabase.insertPost(postDB);
  
      const output: CreatePostOutputDTO = undefined;
  
      return output;
    };
  
    public getPost = async (
      input: GetPostsInputDTO
    ): Promise<GetPostsOutputDTO> => {
      const { token } = input;
  
      const payload = this.tokenManager.getPayload(token);
  
      if (!payload) {
        throw new UnauthorizedError();
      }
  
      const postDBWithCreatorName = await this.postDatabase.getPostWithCreatorName();
  
      const postModel = postDBWithCreatorName.map((post) => {
        const p = new Post(
          post.id,
          post.creator_id,
          post.content,
          post.likes,
          post.dislikes,
          post.created_at,
          post.updated_at,
          post.creator_name
        );
  
        return p.toBusinessModel();
      });
  
      const output: GetPostsOutputDTO = postModel;
  
      return output;
    };
  
    public editPost = async (
      input: EditPostInputDTO
    ): Promise<EditPostOutputDTO> => {
      const { content, token, idToEdit } = input;
  
      const payload = this.tokenManager.getPayload(token);
  
      if (!payload) {
        throw new UnauthorizedError();
      }
  
      const postDB = await this.postDatabase.findPostById(idToEdit);
  
      if (!postDB) {
        throw new NotFoundError("Post com esse id não existe");
      }
      if (payload.id !== postDB.creator_id) {
        throw new ForbiddenError("Somente quem criou o post pode editá-lo!");
      }
  
      const post = new Post(
        postDB.id,
        postDB.creator_id,
        postDB.content,
        postDB.likes,
        postDB.dislikes,
        postDB.created_at,
        postDB.updated_at,
        payload.name
      );
  
      post.setContent(content);
      const updatePostDB = post.toDBModel();
      await this.postDatabase.updatePost(updatePostDB);
  
      const output: EditPostOutputDTO = undefined;
  
      return output;
    };
  
    public deletePost = async (
      input: DeletePostInputDTO
    ): Promise<DeletePostOutputDTO> => {
      const { token, idToDelete } = input;
  
      const payload = this.tokenManager.getPayload(token);
  
      if (!payload) {
        throw new UnauthorizedError();
      }
  
      const postDB = await this.postDatabase.findPostById(idToDelete);
  
      if (!postDB) {
        throw new NotFoundError("Post com esse id não existe");
      }
      if (payload.role !== USER_ROLES.ADMIN) {
        if (payload.id !== postDB.creator_id) {
          throw new ForbiddenError("Somente quem criou o post pode deletá-lo!");
        }
      }
  
      await this.postDatabase.deletePostById(idToDelete);
  
      const output: DeletePostOutputDTO = undefined;
  
      return output;
    };
  
    public likeOrDislikePost = async (
      input: LikeDislikePostInputDTO
    ): Promise<LikeDislikePostOutputDTO> => {
      const { token, postId, like } = input;
  
      const payload = this.tokenManager.getPayload(token);
  
      if (!payload) {
        throw new UnauthorizedError();
      }
  
      const postDBWithCreatorName = await this.postDatabase.findPostWithCreatorDBById(
        postId
      );
  
      if (!postDBWithCreatorName) {
        throw new NotFoundError("Post com esse id não existe");
      }
  
      const likeDislikeDB: LikeDislikeDB = {
        user_id: payload.id,
        post_id: postId,
        like: like ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED,
      };
  
      await this.postDatabase.likeDislikePost(likeDislikeDB);
  
      const output: LikeOrDislikePostOutputDTO = undefined;
  
      return output;
    };