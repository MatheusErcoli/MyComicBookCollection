import { Request, Response, NextFunction } from "express";
import CollectionService from "../services/colecaoPagina.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class CollectionController {
  static async index(req: any, res: Response, next: NextFunction) {
    try {
      const { page, limit, status } = req.query;

      const { limit: limitNumber, offset, page: pageNumber } = getPaginacao(
        Number(page),
        Number(limit)
      );

      const data = await CollectionService.index(
        req.userId,
        limitNumber,
        offset,
        typeof status === "string" ? status : undefined
      );

      const response = getPaginacaoDados(
        {
          count: data.count,
          rows: data.rows,
        },
        pageNumber,
        limitNumber
      );

      return res.json({
        totalItems: response.totalItems,
        totalPages: response.totalPages,
        currentPage: response.currentPage,
        items: response.data,
        editoras: data.editoras,
        autores: data.autores,
      });
    } catch (error) {
      next(error);
    }
  }
}