import express from "express";
import { Router } from "express";
import { PostController } from "./Post.controler";
import { authMiddleware, UserRole } from "../../Middleware/auth";
const router = Router();

router.get("/",PostController.getALLPosts);
router.get("/:id",PostController.getPostById);




router.post("/", authMiddleware(UserRole.USER), PostController.createPost);

export const Postrouter = router;
