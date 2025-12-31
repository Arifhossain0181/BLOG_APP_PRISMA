import express from 'express';
import { Postrouter } from './modules/Post.router';
import { auth } from './lib/auth';
import { toNodeHandler } from "better-auth/node";
import dotenv from 'dotenv';

const app = express();

app.use(express.json());

// Debug logging
app.use('/api/auth', (req, res, next) => {
    console.log('Auth request:', req.method, req.url);
    console.log('Body:', req.body);
    next();
});

app.use('/api/auth', toNodeHandler(auth));


app.use('/Posts', Postrouter);

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: err.message || 'Internal Server Error' });
});

export default app;
