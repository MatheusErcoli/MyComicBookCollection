import { Request, Response, NextFunction } from "express";
import DesenhistaService from "../services/desenhista.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";



export default class DesenhistaController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const desenhista = await DesenhistaService.create(req.body);

      return res.status(201).json(desenhista);
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

      const data = await DesenhistaService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const desenhista = await DesenhistaService.findById(id);

      return res.json(desenhista);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const desenhista = await DesenhistaService.update(id, req.body);

      return res.json(desenhista);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await DesenhistaService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}