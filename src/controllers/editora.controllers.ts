import { Request, Response, NextFunction } from "express";
import EditoraService from "../services/editora.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class EditoraController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      const editora = await EditoraService.create(req.body);

      return res.status(201).json(editora);
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

      const data = await EditoraService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const editora = await EditoraService.findById(id);

      return res.json(editora);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const editora = await EditoraService.update(id, req.body);

      return res.json(editora);
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await EditoraService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}