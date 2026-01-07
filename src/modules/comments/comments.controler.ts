import { Request,Response } from "express"
import { commnetsService } from "./comments.serverics"

const createComment = async(req:Request,res:Response)=>{
    try{
        const user = req.user;
        req.body.authorId = user?.id
        const result = await commnetsService.createComments(req.body);
        res.status(201).json(result);
    }
    catch(error){
        res.status(400).json({
            error:"comments creation",
            details:error
        })
    }

}

const getCommentByID = async (req:Request,res:Response)=>{
    try{
        const {commentId} = req.params;
        const result = await commnetsService.getCommentByID(commentId as string);
        res.status(200).json({result})


    }
    catch(error){
        res.status(401).json({
            error:"failed",
            details:error
        })
    }
}
const getAuthorId = async(req:Request ,res:Response)=>{
    try{
        const {authorId}= req.params;
        const result = await commnetsService.getCommentByAuthor(authorId as string)
        res.status(200).json(result)

    }
    catch(error){
        res.status(400).json({
            error:"failed",
            
        })
    }
}
const deletecommets = async (req:Request,res:Response)=>{
    try{
        const user = req.user 
        const {commentId} = req.params
        const result = await commnetsService.deletecommets(commentId as string,user?.id as string)
        res.status(200).json(result)
    }
    catch(error){
        res.status(400).json({
            error:"failed",
            details:error
        })
    }
}


export const commentscontroller ={
    createComment,
    getCommentByID,
    getAuthorId,
    deletecommets
}