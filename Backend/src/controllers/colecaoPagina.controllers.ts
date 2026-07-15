import { Request, Response, NextFunction } from "express";
import CollectionService from "../services/colecaoPagina.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class CollectionController {
  static async index(req: any, res: Response, next: NextFunction) {
    try {
      const { page, limit, status, search, editoraId, autorId } = req.query;

      const { limit: limitNumber, offset, page: pageNumber } = getPaginacao(
        Number(page),
        Number(limit)
      );

      const data = await CollectionService.index(
        req.userId,
        limitNumber,
        offset,
        {
          ...(typeof status === "string" && status ? { status } : {}),
          ...(typeof search === "string" && search ? { search } : {}),
          ...(typeof editoraId === "string" && editoraId
            ? { editoraId: Number(editoraId) }
            : {}),
          ...(typeof autorId === "string" && autorId
            ? { autorId: Number(autorId) }
            : {}),
        }
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