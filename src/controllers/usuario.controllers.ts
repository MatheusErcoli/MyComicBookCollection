import { Response, NextFunction } from "express";
import UsuarioService from "../services/usuario.services";
import { getPaginacao, getPaginacaoDados } from "../utils/paginacao";

export default class UsuarioController {

  static async create(req: any, res: Response, next: NextFunction) {
    try {
      const { nome, email, senha } = req.body;

      const usuario = await UsuarioService.create({
        nome,
        email,
        senha
      });

      return res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email });
    } catch (error) {
      next(error);
    }
  }

  static async findAll(req: any, res: Response, next: NextFunction) {
    try {
      const { page, limit } = req.query;

      const { limit: limitNumber, offset, page: pageNumber } =
        getPaginacao(Number(page), Number(limit));

      const data = await UsuarioService.findAll(limitNumber, offset);

      const response = getPaginacaoDados(data, pageNumber, limitNumber);

      return res.json(response);
    } catch (error) {
      next(error);
    }
  }

  static async findOne(req: any, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const usuario = await UsuarioService.findById(id);

      return res.json(usuario);
    } catch (error) {
      next(error);
    }
  }

  static async update(req: any, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const updated = await UsuarioService.update(id, req.body);

      return res.json({ id: updated.id, nome: updated.nome, email: updated.email });
    } catch (error) {
      next(error);
    }
  }

  static async delete(req: any, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);

      const result = await UsuarioService.delete(id);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: any, res: Response, next: NextFunction) {
    try {
      const { email, senha } = req.body;

      const result = await UsuarioService.login(email, senha);

      return res.json(result);
    } catch (error) {
      next(error);
    }
  }
}