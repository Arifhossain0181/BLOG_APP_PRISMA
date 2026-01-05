import { Post, PostStatus } from "../../generated/prisma/client";
import { SortOrder } from "../../generated/prisma/internal/prismaNamespace";
import { PostWhereInput } from "../../generated/prisma/models";
import { prisma } from "../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPosts = async (payload: {
  search?: string | undefined;
  tags?: string[] | [],
    isFeatured?:boolean | undefined,
    status?:PostStatus | undefined,
    page?: number,
    pageSize?: number,
    skip?: number,
    sortBy?: string | undefined,
    sortOrder:string | undefined,
}) => {
  try {
    console.log("get all Post", payload);
    const andConditions:PostWhereInput[] = [];
    if (payload.search) {
      andConditions.push({
        OR: [
          {
            title: {
              contains: payload.search as string,
              mode: "insensitive",
            },
          },
          {
            content: {
              contains: payload.search as string,
              mode: "insensitive",
            },
          },
          {
            tags: {
              has: payload.search as string,
            },
          },
        ],
      });
    }
    if (payload.tags && payload.tags.length > 0) {
      andConditions.push({
        tags: {
          hasEvery: payload.tags as string[],
        },
      });
    }
    if(typeof payload.isFeatured === "boolean"){
        andConditions.push({
            isFeatured: payload.isFeatured
        })
    }
    if(payload.status){
        andConditions.push({
            status: payload.status

        })
    }


    // Calculate pagination
    const page = payload.page || 1;
    const pageSize = payload.pageSize || 10;
    const skip = (page - 1) * pageSize;

    // Get total count for pagination metadata
    const totalCount = await prisma.post.count({
      where: andConditions.length > 0 ? { AND: andConditions } : {},
    });

    const result = await prisma.post.findMany({
      take : pageSize,
      skip : skip,
      where: andConditions.length > 0 ? { AND: andConditions } : {},
      orderBy: payload.sortBy && payload.sortOrder ? {
        [payload.sortBy]: payload.sortOrder as SortOrder
      } : {
        createdAt: 'desc'
      }
      
    });
    const total = await prisma.post.count({
      where:{
        AND: andConditions
      }
    })


    return {
      data: result,
      pagination: {
        page,
        pageSize,
        totalCount: total,
        totalPages: Math.ceil(total / pageSize),
        
      },
    };
  } catch (error) {
    throw error;
  }
};


///get Post by ID

const getPostById = async (id:string) => {
  const result = await prisma.$transaction(async(tx)=>{
    const updatedPost = await tx.post.update({
    where:{
      id: id
    },
    data:{
      view: {
        increment: 1
      }
    }
  });
  const result = await tx.post.findUnique({
    where:{
      id: id
    }
  });
  return result;
  })
  return result;
}


export const PostService = {
  createPost,
  getAllPosts,
  getPostById
};
