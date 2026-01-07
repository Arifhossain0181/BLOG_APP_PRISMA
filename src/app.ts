import express from 'express';
import { Postrouter } from './modules/Post/Post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import cors from 'cors';
import { commetentrouter } from './modules/comments/comments.router';
const app = express();

app.use(express.json());
app.use(cors({
    origin: process.env.APP_URL || "http://localhost:4000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}))

// Debug logging
app.use('/api/auth', (req, res, next) => {
    console.log('Auth request:', req.method, req.url);
    console.log('Body:', req.body);
    next();
});

app.use('/api/auth', toNodeHandler(auth));


app.use('/Posts', Postrouter);
app.use('/comments', commetentrouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
