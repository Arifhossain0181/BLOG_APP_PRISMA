import { Request, Response } from "express";
import { PostService } from "./Post.serverice";
import { Post, PostStatus } from "../../../generated/prisma/client";
import Paginationandsorting from "../../HelPers/Paginationandsorting";
import { UserRole } from "../../Middleware/auth";


const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const rsult = await PostService.createPost(req.body, user.id as string);
    res.status(201).json(rsult);
  } catch (error) {
    res.status(500).json({ error: "Failed to create post" });
  }
};

const getALLPosts = async (req: Request, res: Response) => {
  try {
    //search all posts by title or content
    const { search } = req.query;
    const searchstring = typeof search === "string" ? search : undefined;
    console.log("Search query:", searchstring);

    //filtering tags all posts by tags
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];

    //boolenean to check if tags is present in query

    const isFeatured =
      req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined;
    console.log(isFeatured);
    //status
    const status = req.query.status as PostStatus | undefined;

    /// Pagination

    const oPtions = Paginationandsorting(req.query);
    console.log(oPtions);

    //get all posts
    const result = await PostService.getAllPosts({
      search: searchstring,
      tags: tags,
      isFeatured: isFeatured,
      status: status,

      page: oPtions.page,
      pageSize: oPtions.pageSize,
      skip: oPtions.skip,
      sortBy: oPtions.sortBy,
      sortOrder: oPtions.sortOrder,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch posts", details: error });
  }
};

const getPostById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ error: "Post ID is required" });
        }
        const result = await PostService.getPostById(id as string);
        console.log(id)
        res.status(200).json(result);
    }
    catch(error){
        res.status(500).json({ error: "Failed to fetch post" });
    }
}
const getMyPosts = async (req: Request, res: Response) => {
  try{
    const user = req.user;
    console.log("user data",user)
    if(!user){
      throw new Error("Unauthorized");
    }
    const result = await PostService.getMyPosts(user?.id as string);
    res.status(200).json(result);
  }
  catch(error){
    res.status(500).json({ error: "Failed to fetch post", details: error });
  }
}
const updatePost = async (req: Request, res: Response) => {
  try{
    const user = req.user;
    if(!user){
      return res.status(401).json({ error: "Unauthorized" });
    }
    const {postId} = req.params;
    const isAdmin= user.role === UserRole.ADMIN
  
    const result = await PostService.updatePost(postId as string, req.body, user.id as string , isAdmin);
    res.status(200).json(result);
  }
  catch(error: any){
    console.error("Update Post Error:", error);
    const statusCode = error.message?.includes("Unauthorized") ? 403 : 500;
    res.status(statusCode).json({ 
      error: "Failed to update post", 
      message: error.message || "Unknown error",
      details: error 
    }); 
  }
}

export const PostController = {
  createPost,
  getALLPosts,
  getPostById,
  getMyPosts,
  updatePost
};
