import express from "express";
import { Router } from "express";
import { commentscontroller } from "./comments.controler";
import authMiddleware, { UserRole } from "../../Middleware/auth";
const router = Router();

router.post('/',authMiddleware(UserRole.USER, UserRole.ADMIN),commentscontroller.createComment)

router.get("/:commentId",commentscontroller.getCommentByID)
router.get("/author/:authorId",commentscontroller.getAuthorId)
router.delete("/:commentId",authMiddleware(UserRole.USER,UserRole.ADMIN), commentscontroller.deletecommets);
    
router.put("/:commentId",authMiddleware(UserRole.USER,UserRole.ADMIN), commentscontroller.updateComments);

router.patch("/:commentId/moderate",authMiddleware(UserRole.ADMIN), commentscontroller.moderateComments); 





export const commetentrouter = router;
