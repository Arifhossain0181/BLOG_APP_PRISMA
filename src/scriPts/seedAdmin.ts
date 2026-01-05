import { Prisma } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";
import { UserRole } from "../Middleware/auth";
import crypto from "crypto";

// Hash password - better-auth compatible
function hashPassword(password: string): string {
    return crypto.pbkdf2Sync(password, 'salt', 100000, 64, 'sha512').toString('hex');
}

async function seedAdmin(){
    // Function implementation goes here
    try{
        // creating admin
        const admindata = {
            name:"Admin4 Saheb",
            email:"admin4@example.com",
            password:"adminpassword",
            role:UserRole.ADMIN,
           
        }
        //checking  exists user or not
        const userExists = await prisma.user.findUnique({
            where:{
                email: admindata.email
            }

        })
        if(userExists){
            console.log("✓ User already exists in database");
            await prisma.$disconnect();
            process.exit(0);
        }
        
        // Create user and account directly in database
        const hashedPassword = hashPassword(admindata.password);
        
        await prisma.user.create({
            data: {
                name: admindata.name,
                email: admindata.email,
                emailVerified: true,
                role: admindata.role,
                accounts: {
                    create: {
                        accountId: `email:${admindata.email}`,
                        providerId: "credential",
                        password: hashedPassword,
                    }
                }
            }
        });

        console.log("✓ Admin created successfully");
        console.log("Email:", admindata.email);
        console.log("Password:", admindata.password);
        
        await prisma.$disconnect();
        process.exit(0);
    }
    catch(error){
        console.error("Error adding admin:", error);
        await prisma.$disconnect();
        process.exit(1);
    }
}

seedAdmin();