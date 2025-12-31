import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { stat } from "node:fs";
import nodemailer from "nodemailer";


const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: process.env.APP_USER || "BLOG.gmail.com",
    pass: process.env.APP_PASSWORD ,
  },
});



export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    trustedOrigins: [process.env.APP_URL || "http://localhost:3000"],
    advanced: {
        disableCSRFCheck: true, // For development/testing
    },
    user: {
        additionalFields: {
            role: { 
                type: "string", 
                defaultValue: "user",
                required: false
            },
            phone: {
                type: "string",
                required: false
            },
            status: {
                type: "string",
                defaultValue: "active",
                required: false
            }
        }
    },
    emailAndPassword: { 
        enabled: true,
        autoSignIn:false,
        requireEmailVerification:true,
    },
       emailVerification: {
        sendOnSignUp:true,
        autoSignInAfterVerification: true,

    sendVerificationEmail: async ( { user, url, token }, request) => {
        console.log({user,url,token})
        try {
            const verifictionUrl = `${process.env.APP_URL}/verify-email?token=${token}`;
            const info = await transporter.sendMail({
                from: '"Prisma blog" <Prisma@gmail.com>',
                to: user.email,
                subject: "Please verify your email address",
                
                html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Email Verification</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f4f6f8;
      font-family: Arial, Helvetica, sans-serif;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background-color: #ffffff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
    }
    .header {
      background-color: #2563eb;
      padding: 20px;
      text-align: center;
      color: #ffffff;
    }
    .header h1 {
      margin: 0;
      font-size: 24px;
    }
    .content {
      padding: 30px;
      color: #333333;
      line-height: 1.6;
    }
    .content h2 {
      margin-top: 0;
      font-size: 20px;
    }
    .verify-btn {
      display: inline-block;
      margin: 25px 0;
      padding: 14px 28px;
      background-color: #2563eb;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: bold;
    }
    .verify-btn:hover {
      background-color: #1e4fd8;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 15px;
      text-align: center;
      font-size: 12px;
      color: #64748b;
    }
    .link {
      word-break: break-all;
      font-size: 13px;
      color: #2563eb;
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <h1>Prisma Blog</h1>
    </div>

    <div class="content">
      <h2>Verify your email address</h2>
      <p>
        Hi ${user.name},<br /><br />
        Thank you for signing up to <strong>Prisma Blog</strong>.
        Please confirm your email address by clicking the button below.
      </p>

      <p style="text-align: center;">
        <a href="${verifictionUrl}" class="verify-btn">
          Verify Email
        </a>
      </p>

      <p>
        If the button doesnt work, copy and paste the following link into your browser:
      </p>

      <p class="link">
        ${verifictionUrl}
      </p>

      <p>
        This verification link will expire in <strong>24 hours</strong>.
        If you did not create this account, you can safely ignore this email.
      </p>

      <p>
        Thanks,<br />
        <strong>Prisma Blog Team</strong>
      </p>
    </div>

    <div class="footer">
      © 2025 Prisma Blog. All rights reserved.
    </div>
  </div>

</body>
</html>
`
            });

            console.log("Message sent:", info.messageId);
        } catch(error) {
            console.error("Error sending verification email:", error);
            throw new Error("Could not send verification email");
        }
    },
  },
  //google social provider
   socialProviders: {
        google: { 
            prompt:"select_account consent",
            accessType:"offline",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            
        }, 
    },
    secret: process.env.BETTER_AUTH_SECRET || "secret-key-minimum-32-characters-long",
});