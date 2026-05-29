import HQ from "../models/hq";
import Autor from "../models/autor";
import Desenhista from "../models/desenhista";
import Editora from "../models/editora";
import Colecao from "../models/colecao";
import Usuario from "../models/usuario";
import { HQAttributes } from "../types/hq.types";

export default class HQService {

  static async create(data: HQAttributes) {
    return await HQ.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await HQ.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
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
        },
        {
          model: Usuario,
          as: "colecionadores",
          through: { attributes: [] }
        }
      ]
    });
  }

  static async findById(id: number) {
    const hq = await HQ.findByPk(id, {
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
        },
        {
          model: Usuario,
          as: "colecionadores",
          through: { attributes: [] }
        }
      ]
    });

    if (!hq) {
      throw new Error("HQ não encontrada");
    }

    return hq;
  }

  static async update(id: number, data: HQAttributes) {
    const hq = await this.findById(id);
    return await hq.update(data);
  }

  static async delete(id: number) {
    const hq = await this.findById(id);
    await hq.destroy();

    return { message: "HQ deletada com sucesso" };
  }
}