import { Request, Response, NextFunction } from "express";
import HQColecaoService from "../services/hq_colecao.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";


export default class HQColecaoController {

  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const relacao = await HQColecaoService.create(req.body);
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

      const data = await HQColecaoService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const relacao = await HQColecaoService.findById(id);

      return res.json(relacao);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const relacao = await HQColecaoService.update(id, req.body);

      return res.json(relacao);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await HQColecaoService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}