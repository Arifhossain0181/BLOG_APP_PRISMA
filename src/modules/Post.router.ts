import express  from "express";
import { Router } from "express";
import { PostController } from "./Post.controler";

const router = Router();

router.post("/",PostController.createPost);

export const  Postrouter = router;
