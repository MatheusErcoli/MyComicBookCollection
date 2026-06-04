import { NextFunction, Request, Response } from "express";

export function errorMiddleware(
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error("[Error Middleware]", error);

  // Handle common Sequelize errors with clearer status codes/messages
  if (error && typeof error === "object") {
    const name = (error as any).name;

    if (name === "SequelizeUniqueConstraintError") {
      const details = (error as any).errors || [];
      const first = details[0] || {};
      const field = first.path || Object.keys((error as any).fields || {})[0];
      const message = first.message || "Duplicate entry";
      return res.status(409).json({ error: message, field });
    }

    if (name === "SequelizeValidationError") {
      const details = (error as any).errors || [];
      const messages = details.map((d: any) => d.message);
      return res.status(400).json({ error: messages.join(', '), details });
    }

    if (name === "SequelizeDatabaseError") {
      return res.status(500).json({ error: (error as any).parent?.sqlMessage || (error as any).message });
    }
  }

  if (error instanceof Error) {
    const message = error.message || "Erro interno do servidor";

    if (message === "Usuário não encontrado" || message === "Senha inválida") {
      return res.status(401).json({ error: message });
    }

    return res.status(500).json({ error: message });
  }

  return res.status(500).json({ error: "Erro interno do servidor" });
}
