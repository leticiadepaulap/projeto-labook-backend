import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase {
    public static TABLE_POST = "post"
    public static TABLE_LIKE_DISLIKES = "likes_dislikes"
}