import express from "express";
import { Router } from "express";
import { commentscontroller } from "./comments.controler";
import authMiddleware, { UserRole } from "../../Middleware/auth";
const router = Router();

router.post('/',authMiddleware(UserRole.USER, UserRole.ADMIN),commentscontroller.createComment)

router.get("/:commentId",commentscontroller.getCommentByID)
router.get("/author/:authorId",commentscontroller.getCommentByID)
router.delete("/:commentId",authMiddleware(UserRole.USER,UserRole.ADMIN), commentscontroller.deletecommets)





export const commetentrouter = router;
