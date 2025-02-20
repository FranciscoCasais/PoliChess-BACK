import { HttpStatusCodes } from "../constants/HttpStatusCodes";
import { Request, Response, NextFunction } from "express";
import { JwtPayload } from "jsonwebtoken";
import { verifyToken } from "./jwt";

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "No autorizado" });
    return;
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    res.status(HttpStatusCodes.UNAUTHORIZED).json({ message: "Token inválido" });
    return;
  }

  (req as any).id = (decoded as JwtPayload).id;
  (req as any).isAdmin = (decoded as JwtPayload).isAdmin;
  next();
}
