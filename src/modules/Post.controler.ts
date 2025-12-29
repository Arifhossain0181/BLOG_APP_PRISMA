import { Request, Response } from "express";
import { PostService } from "./Post.serverice";
import { Post } from "../../generated/prisma/client";

const createPost = async (req:Request, res:Response) => {
try{
    const rsult = await PostService.createPost(req.body );
    res.status(201).json(rsult);
} catch (error) {
    res.status(500).json({ error: "Failed to create post" });
}
}
export const PostController = {
    createPost
};