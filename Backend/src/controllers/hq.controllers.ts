import { Request, Response, NextFunction } from "express";
import HQService from "../services/hq.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class HQController {

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const hq = await HQService.create(req.body);

      return res.status(201).json(hq);
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

      const data = await HQService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const hq = await HQService.findById(id);

      return res.json(hq);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const hq = await HQService.update(id, req.body);

      return res.json(hq);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await HQService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}

