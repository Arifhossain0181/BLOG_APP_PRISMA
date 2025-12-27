import { prisma } from "./lib/prisma";
import app from "./app";
async function main(){
    try{
        await prisma.$connect();
        console.log("Database connected successfully");

        //
        app.listen(process.env.PORT || 3000,() =>{
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        })

    }
    catch(error){
        console.log("Error:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}
main();