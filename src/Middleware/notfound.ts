import { NextFunction, Request, Response } from "express";

export function notfound(req: Request, res: Response, next: NextFunction) {
    res.status(404).json({ 
        error: "Route not found",
        message: `The requested URL ${req.originalUrl} was not found on this server.`
    }   );

}