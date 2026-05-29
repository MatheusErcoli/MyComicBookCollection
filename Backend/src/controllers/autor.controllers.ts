import { Request, Response, NextFunction } from "express";
import AutorService from "../services/autor.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class AutorController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const autor = await AutorService.create(req.body);

      return res.status(201).json(autor);
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

      const data = await AutorService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const autor = await AutorService.findById(id);

      return res.json(autor);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const autor = await AutorService.update(id, req.body);

      return res.json(autor);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await AutorService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}