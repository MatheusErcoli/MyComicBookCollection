import HQAutor from "../models/hq_autor";
import HQ from "../models/hq";
import Autor from "../models/autor";
import { HQAutorAttributes } from "../types/hq_autor.types";

export default class HQAutorService {

  static async create(data: HQAutorAttributes) {
    return await HQAutor.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await HQAutor.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: HQ,
          as: "hq"
        },
        {
          model: Autor,
          as: "autor"
        }
      ]
    });
  }

  static async findById(id: number) {
    const relacao = await HQAutor.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "hq"
        },
        {
          model: Autor,
          as: "autor"
        }
      ]
    });

    if (!relacao) {
      throw new Error("Relação HQ-Autor não encontrada");
    }

    return relacao;
  }

  static async update(id: number, data: HQAutorAttributes) {
    const relacao = await this.findById(id);
    return await relacao.update(data);
  }

  static async delete(id: number) {
    const relacao = await this.findById(id);
    await relacao.destroy();

    return { message: "Relação deletada com sucesso" };
  }
}