import { Request, Response } from "express";
import { PostService } from "./Post.serverice";
import { Post, PostStatus } from "../../generated/prisma/client";

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

const getALLPosts
 = async (req:Request, res:Response) => {
    try{
        //search all posts by title or content 
        const {search} = req.query;
        const searchstring = typeof search === "string" ? search : undefined;
        console.log("Search query:", searchstring);

        //filtering tags all posts by tags
        const tags = req.query.tags?(req.query.tags as string).split(","):[];

        //boolenean to check if tags is present in query

        const isFeatured = req.query.isFeatured === 'true' ? true : req.query.isFeatured ==='false' ? false : undefined;
        console.log(isFeatured )
        //status  
        const status = req.query.status as PostStatus | undefined;


        //get all posts
        const result = await PostService.getAllPosts({search: searchstring, tags: tags , isFeatured: isFeatured ,status: status });
        res.status(200).json(result);


    }
    catch (error) {
        res.status(500).json({ error: "Failed to fetch posts" ,details:error});

    }
}

export const PostController = {
    createPost,
    getALLPosts
};