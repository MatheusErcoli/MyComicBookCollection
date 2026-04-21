import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthTokenPayload {
  id: number;
  admin: boolean;
}

export function authMiddleware(req: any, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: "Token não fornecido" });
  }

  const [, token] = authHeader.split(" ");

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as AuthTokenPayload;

    req.userId = decoded.id;
    req.userAdmin = decoded.admin;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
}
