import { Post, PostStatus } from "../../generated/prisma/client";
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


    const result = await prisma.post.findMany({
      where: andConditions.length > 0 ? { AND: andConditions } : {},
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const PostService = {
  createPost,
  getAllPosts,
};
