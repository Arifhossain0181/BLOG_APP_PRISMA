import { error } from "node:console";
import { CommentStatus, Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";


const createComments = async(playload:{
    content:string;
    authorId:string;
    postId:string;
    parentId:string
})=>{
    const Postdata = await prisma.post.findUniqueOrThrow({
        where:{
            id:playload.postId
        }
    })
    if(playload.parentId){
        const Parentdata = await prisma.comments.findUniqueOrThrow({
            where:{
                id:playload.parentId
            }
        })
    }
    return await prisma.comments.create({
        data:playload

    })
}

const getCommentByID = async (commentId:string) =>{
    console.log("commet by id",commentId);
    return await prisma.comments.findUnique({
        where:{
            id:commentId
        },
        include:{
            post:{
                select:{
                    id:true,
                    title:true,
                    view:true
                }
            }
        }
    })

}

const getCommentByAuthor =async(authorId:string)=>{
   console.log(authorId)
   return await prisma.comments.findMany({
    where:{
    authorId
    },
    orderBy:{createdAt:"desc"},
    include:{
        post:{
            select:{
                id:true,
                title:true
            }
        }
    }
   })

}
// 1 nijer comment delete korete Parbe 
// login thake hove 
//tar nijer comments kina check korete hobe 
const deletecommets = async(commentId:string ,authorId:string)=>{
    console.log("delete",commentId,authorId)
    const commentData = await prisma.comments.findFirst({
       where:{
        id: commentId,
        authorId
       }
    })
    console.log('comment data')
    if(!commentData){
        throw new Error("your PRovided data is invalid")
    }
    return await  prisma.comments.delete({
        where:{
            id:commentData.id as string
        }
    })
}
// authorID ,commentID ,UPDate data
const UPdatecomments = async(commentID:string, authorID:string, data:{content?:string ,status?:CommentStatus})=>{
    const commentData = await prisma.comments.findFirst({
        where:{
            id:commentID,
            authorId:authorID
        }
        ,select:{
            id:true
        }
    })
    if(!commentData){
        throw new Error("invalid data provided")
    }
    return await prisma.comments.update({
        where:{
            id:commentData.id as string,
            authorId:authorID
        },
        
            data:data
        
    })


}
const moderateComments = async( id: string,  data:{status:CommentStatus})=>{

    const commentData = await prisma.comments.findUniqueOrThrow({
        where:{
            id
        },
        select:{
            id:true,
            status:true
        }

    })

    if(commentData.status === data.status){
      throw new Error("Comment is already in the desired status")

    }


    return await prisma.comments.update({
        where:{
            id:commentData.id
        },
        data:{
            status:data.status
        }
    })


}
export const commnetsService = {
    createComments,
    getCommentByID,
    getCommentByAuthor,
    deletecommets,
    UPdatecomments,
    moderateComments
}