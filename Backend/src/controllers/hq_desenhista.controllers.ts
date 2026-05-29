import { Request, Response, NextFunction } from "express";
import HQDesenhistaService from "../services/hq_desenhista.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";


export default class HQDesenhistaController {

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const relacao = await HQDesenhistaService.create(req.body);
      return res.status(201).json(relacao);
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

      const data = await HQDesenhistaService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const relacao = await HQDesenhistaService.findById(id);

      return res.json(relacao);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const relacao = await HQDesenhistaService.update(id, req.body);

      return res.json(relacao);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await HQDesenhistaService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}