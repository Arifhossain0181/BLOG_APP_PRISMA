import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorhandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
) {
    let statusCode = 500;
    let errormessage = 'Internal Server Error';
    let errorDetails = err;

    // Customize error response based on error type
     if(err instanceof Prisma.PrismaClientValidationError){
        statusCode = 400;
        errormessage = 'you Provide incorrect filed type or missing filed';
    }
    else if(err instanceof Prisma.PrismaClientKnownRequestError){
        if(err.code === 'P2025'){
            statusCode = 404;
            errormessage = 'Record not found';


        }
        else if(err.code === 'P2002'){
            statusCode = 409;
            errormessage = 'Unique constraint failed';
        }
        else if(err.code === 'P2003'){
            statusCode = 400;
            errormessage = 'Foreign key constraint failed';
        }
    

     }
     else if(err instanceof Prisma.PrismaClientUnknownRequestError){
        statusCode = 500;
        errormessage = 'An unknown error occurred with the database client';

     }
     else if(err instanceof Prisma.PrismaClientInitializationError){
        statusCode = 500;
        errormessage = 'Failed to initialize database client';
     }
        else if(err instanceof Prisma.PrismaClientInitializationError){
        statusCode = 500;
        errormessage = 'Failed to initialize database client';
        }
        else if(err instanceof Prisma.PrismaClientRustPanicError){
        statusCode = 500;
        errormessage = 'A panic occurred in the database client';
        }
        else if( err.erroCode ==="P1001" ){
        statusCode = 503;
        errormessage = 'Database connection error';
        }




      res.status(statusCode).json({
        error: errormessage,
        details: errorDetails,
     });
    }

    

    
   


export default errorhandler