import { Request, Response, NextFunction } from "express";
import UsuarioService from "../services/usuario.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class UsuarioController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const usuario = await UsuarioService.create(req.body);

      return res.status(201).json(usuario);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;

      const { limit: limitNumber, offset, page: pageNumber } = getPaginacao(
        Number(page),
        Number(limit)
      );

      const data = await UsuarioService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const usuario = await UsuarioService.findById(id);

      return res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const usuario = await UsuarioService.update(id, req.body);

      return res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await UsuarioService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}