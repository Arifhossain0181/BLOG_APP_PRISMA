import { Request, Response, NextFunction } from "express";
import { auth as betterAuth } from "../lib/auth";

export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: UserRole;
        emailVerified: boolean;
      };
    }
  }
}

export const authMiddleware = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const session = await betterAuth.api.getSession({
        headers: req.headers as any,
      });

      if (!session) {
        console.log("ERROR: No session found");
        return res.status(401).json({ error: "Unauthorized" });
      }

      console.log("========== USER SESSION DETAILS ==========");
      console.log("ID:", session.user.id);
      console.log("Name:", session.user.name);
      console.log("Email:", session.user.email);
      console.log("Role from DB:", session.user.role);
      console.log("Email Verified:", session.user.emailVerified);
      console.log("Required Roles:", roles);
      console.log("=========================================");

      const role = (session.user.role || "user").toUpperCase() as UserRole;

      if (!session.user.emailVerified) {
        console.log("ERROR: Email not verified");
        return res.status(403).json({ error: "Email not verified" });
      }

      if (roles.length && !roles.includes(role)) {
        console.log(
          "ERROR: Role mismatch - User has:",
          role,
          "Needs one of:",
          roles
        );
        return res.status(403).json({ error: "Forbidden" });
      }

      req.user = {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        role,
        emailVerified: session.user.emailVerified,
      };

      console.log("SUCCESS: Authentication passed");

      next();
    } catch (error) {
      console.error("Authentication error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  };
};
export default authMiddleware;
