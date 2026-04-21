import { Request, Response, NextFunction } from "express";
import HQAutorService from "../services/hq_autor.services"; 
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class HQAutorController {

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const relacao = await HQAutorService.create(req.body);
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

      const data = await HQAutorService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const relacao = await HQAutorService.findById(id);

      return res.json(relacao);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const relacao = await HQAutorService.update(id, req.body);

      return res.json(relacao);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await HQAutorService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}