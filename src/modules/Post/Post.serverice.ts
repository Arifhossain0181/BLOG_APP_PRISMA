import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { SortOrder } from "../../../generated/prisma/internal/prismaNamespace";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

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
  tags?: string[] | [];
  isFeatured?: boolean | undefined;
  status?: PostStatus | undefined;
  page?: number;
  pageSize?: number;
  skip?: number;
  sortBy?: string | undefined;
  sortOrder: string | undefined;
}) => {
  try {
    console.log("get all Post", payload);
    const andConditions: PostWhereInput[] = [];
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
    if (typeof payload.isFeatured === "boolean") {
      andConditions.push({
        isFeatured: payload.isFeatured,
      });
    }
    if (payload.status) {
      andConditions.push({
        status: payload.status,
      });
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
      take: pageSize,
      skip: skip,
      where: andConditions.length > 0 ? { AND: andConditions } : {},
      orderBy:
        payload.sortBy && payload.sortOrder
          ? {
              [payload.sortBy]: payload.sortOrder as SortOrder,
            }
          : {
              createdAt: "desc",
            },
    });
    const total = await prisma.post.count({
      where: {
        AND: andConditions,
      },
    });

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

const getPostById = async (id: string) => {
  const result = await prisma.$transaction(async (tx) => {
    const updatedPost = await tx.post.update({
      where: {
        id: id,
      },
      data: {
        view: {
          increment: 1,
        },
      },
    });
    const result = await tx.post.findUnique({
      where: {
        id: id,
      },
      include: {
        comments: {
          where: {
            ParentsId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { createdAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { createdAt: "asc" },
              include: {
                replies: true,
              },
            },
          },
        },
        _count: {
          select: { comments: true },
        },
      },
    });
    return result;
  });
  return result;
};

const getMyPosts = async (authorId: string) => {
  const result = await prisma.post.findMany({
    where: {
      authorId: authorId,
    },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
  const total = await prisma.post.count({
    where: {
      authorId: authorId,
    },
  });
  return { data: result, totalCount: total };
};
const updatePost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const Postdata = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: { id: true, authorId: true },
  });

  if (Postdata.authorId !== authorId && !isAdmin) {
    throw new Error("Unauthorized: You can only update your own posts");
  }

  // Filter out fields that shouldn't be updated
  const { id, authorId: _, createdAt, updatedAt, view, ...updateData } = data;

  const result = await prisma.post.update({
    where: {
      id: postId,
    },
    data: updateData,
  });
  return result;
};
//delete
// user role= nijer post delete korte parbe
// admin role = sobar post delete korte parbe
const deletePost = async (
  postId: string,
  authorId: string,
  isAdmin: boolean
) => {
  const Postdata = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });
  // create korea nijer post delete korte parbe kinha
  if (Postdata.authorId !== authorId && !isAdmin) {
    throw new Error("Unauthorized: You can only delete your own posts");
  }
  return await prisma.post.delete({
    where: {
      id: postId,
    },
  });
};
// statistics
const getstats = async () => {
  // PostCount ,PublishedPostCount ,DraftPostCount ,TotalViews

  return await prisma.$transaction(async (tx) => {
    const [
      totalCount,
      PublishedPostCount,
      DraftPostCount,
      archivedPostCount,
      totalComments,
      approvedComments,
      rejectedComments,
      totaluser,
      admincount,
      usercount,
      totalViews,
    ] = await Promise.all([
      await tx.post.count(),
      await tx.post.count({
        where: {
          status: PostStatus.PUBLISHED,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.DRAFT,
        },
      }),
      await tx.post.count({
        where: {
          status: PostStatus.ARCHIVED,
        },
      }),
      await tx.comments.count(),
      await tx.comments.count({
        where: {
          status: CommentStatus.APPROVED,
        },
      }),
      await tx.comments.count({
        where: {
          status: CommentStatus.REJECTED,
        },
      }),
      await tx.user.count(),
      await tx.user.count({
        where: {
          role: "ADMIN",
        },
      }),
      await tx.user.count({
        where: {
          role: "USER",
        },
      }),
      await tx.post.aggregate({
        _sum: { view: true },
      }),
    ]);

    return {
      totalCount,
      PublishedPostCount,
      DraftPostCount,
      archivedPostCount,
      totalComments,
      approvedComments,
      rejectedComments,
      totaluser,
      admincount,
      usercount,
      totalViews: totalViews._sum.view,
    };
  });
};

export const PostService = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getstats,
};
