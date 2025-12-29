import express from 'express';
import { Postrouter } from './modules/Post.router';


const app = express();


app.use(express.json());
app.use('/Posts', Postrouter);

export default app;
