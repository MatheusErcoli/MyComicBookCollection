import Autor from "../models/autor";
import Colecao from "../models/colecao";
import Desenhista from "../models/desenhista";
import Editora from "../models/editora";
import HQ from "../models/hq";
import HQUsuario from "../models/hq_usuario";
import Usuario from "../models/usuario";
import { HQUsuarioAttributes } from "../types/hq_usuario.types";


export default class HQUsuarioService {

  static async create(data: HQUsuarioAttributes) {
    return await HQUsuario.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await HQUsuario.findAndCountAll({
      limit,
      offset,
      order: [["created_at", "DESC"]],
      include: [
        {
          model: Usuario,
          as: "usuario"
        },
        {
          model: HQ,
          as: "hq",
          include: [
            {
              model: Autor,
              as: "autor",
              through: { attributes: [] }
            },
            {
              model: Desenhista,
              as: "desenhista",
              through: { attributes: [] }
            },
            {
              model: Colecao,
              as: "colecao",
              through: { attributes: [] }
            },
            {
              model: Editora,
              as: "editora"
            }
          ]
        }
      ]
    });
  }

  static async findById(id: number) {
    const relacao = await HQUsuario.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: "usuario"
        },
        {
          model: HQ,
          as: "hq",
          include: [
            {
              model: Autor,
              as: "autor",
              through: { attributes: [] }
            },
            {
              model: Desenhista,
              as: "desenhista",
              through: { attributes: [] }
            },
            {
              model: Colecao,
              as: "colecao",
              through: { attributes: [] }
            },
            {
              model: Editora,
              as: "editora"
            }
          ]
        }
      ]
    });

    if (!relacao) {
      throw new Error("Registro não encontrado");
    }

    return relacao;
  }

  static async update(id: number, data: HQUsuarioAttributes) {
    const relacao = await this.findById(id);
    return await relacao.update(data);
  }

  static async delete(id: number) {
    const relacao = await this.findById(id);
    await relacao.destroy();

    return { message: "Removido da coleção com sucesso" };
  }
}