import { Request, Response } from "express";
import CollectionService from "../services/colecaoPagina.services";

export default class CollectionController {
  static async index(req: Request, res: Response) {
    const userId = req.userId!;

    const hqs = await CollectionService.index(userId);

    return res.json(hqs);
  }
}
