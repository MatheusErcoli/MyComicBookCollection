import { Request, Response, NextFunction } from "express";
import HQUsuarioService from "../services/hq_usuario.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class HQUsuarioController {

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await HQUsuarioService.create(req.body);
      return res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;

      const { limit: limitNumber, offset, page: pageNumber } =
        getPaginacao(Number(page), Number(limit));

      const data = await HQUsuarioService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const data = await HQUsuarioService.findById(id);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const data = await HQUsuarioService.update(id, req.body);

      return res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await HQUsuarioService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}