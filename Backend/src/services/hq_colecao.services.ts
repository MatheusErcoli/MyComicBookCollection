import HQColecao from "../models/hq_colecao";
import HQ from "../models/hq";
import Colecao from "../models/colecao";
import { HQColecaoAttributes } from "../types/hq_colecao.types";

export default class HQColecaoService {

  static async create(data: HQColecaoAttributes) {
    return await HQColecao.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await HQColecao.findAndCountAll({
      limit,
      offset,
      order: [["ordem", "ASC"]], 
      include: [
        {
          model: HQ,
          as: "hq"
        },
        {
          model: Colecao,
          as: "colecao"
        }
      ]
    });
  }

  static async findById(id: number) {
    const relacao = await HQColecao.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "hq"
        },
        {
          model: Colecao,
          as: "colecao"
        }
      ]
    });

    if (!relacao) {
      throw new Error("Relação HQ-Coleção não encontrada");
    }

    return relacao;
  }

  static async update(id: number, data: HQColecaoAttributes) {
    const relacao = await this.findById(id);
    return await relacao.update(data);
  }

  static async delete(id: number) {
    const relacao = await this.findById(id);
    await relacao.destroy();

    return { message: "Relação deletada com sucesso" };
  }
}