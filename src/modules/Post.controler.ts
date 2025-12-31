import { Request, Response } from "express";
import { PostService } from "./Post.serverice";
import { Post } from "../../generated/prisma/client";

const createPost = async (req:Request, res:Response) => {
try{
    const user = req.user;
   if(!user){
    return res.status(401).json({ error: "Unauthorized" });
   }
    const rsult = await PostService.createPost(req.body ,user.id as string);
    res.status(201).json(rsult);
} catch (error) {
    res.status(500).json({ error: "Failed to create post" });
}
}
export const PostController = {
    createPost
};