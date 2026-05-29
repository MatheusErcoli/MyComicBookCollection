import { Request, Response, NextFunction } from "express";
import ColecaoService from "../services/colecao.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class ColecaoController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const colecao = await ColecaoService.create(req.body);

      return res.status(201).json(colecao);
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

      const data = await ColecaoService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const colecao = await ColecaoService.findById(id);

      return res.json(colecao);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const colecao = await ColecaoService.update(id, req.body);

      return res.json(colecao);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await ColecaoService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}