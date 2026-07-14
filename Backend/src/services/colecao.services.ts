import Colecao from "../models/colecao";
import HQ from "../models/hq";
import Editora from "../models/editora";
import { ColecaoAttributes } from "../types/colecao.types";

export default class ColecaoService {

  static async create(data: ColecaoAttributes) {
    return await Colecao.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await Colecao.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: HQ,
          as: "hq",
          through: { attributes: ["ordem"] },
          include: [
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
    const colecao = await Colecao.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "hq",
          through: { attributes: ["ordem"] },
          include: [
            {
              model: Editora,
              as: "editora"
            }
          ]
        }
      ]
    });

    if (!colecao) {
      throw new Error("Coleção não encontrada");
    }

    return colecao;
  }

  static async update(id: number, data: ColecaoAttributes) {
    const colecao = await this.findById(id);
    return await colecao.update(data);
  }

  static async delete(id: number) {
    const colecao = await this.findById(id);
    await colecao.destroy();

    return { message: "Coleção deletada com sucesso" };
  }
}