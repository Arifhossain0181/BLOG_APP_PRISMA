import express from "express";
import { Router } from "express";
import { PostController } from "./Post.controler";
import { authMiddleware, UserRole } from "../../Middleware/auth";
const router = Router();

router.get("/",PostController.getALLPosts);
router.get("/stats",authMiddleware(UserRole.ADMIN),PostController.getstats);
router.get("/my-posts",authMiddleware(UserRole.USER ,UserRole.ADMIN),PostController.getMyPosts);
router.get("/:id",PostController.getPostById);

router.post("/", authMiddleware(UserRole.USER ,UserRole.ADMIN), PostController.createPost);
router.patch("/:postId",authMiddleware(UserRole.USER ,UserRole.ADMIN),PostController.updatePost);
router.delete("/:postId",authMiddleware(UserRole.USER ,UserRole.ADMIN),PostController.deletePost);

export const Postrouter = router;
