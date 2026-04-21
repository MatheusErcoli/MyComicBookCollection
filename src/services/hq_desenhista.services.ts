import HQDesenhista from "../models/hq_desenhista";
import HQ from "../models/hq";
import Desenhista from "../models/desenhista";
import { HQDesenhistaAttributes } from "../types/hq_desenhista.types";

export default class HQDesenhistaService {

  static async create(data: HQDesenhistaAttributes) {
    return await HQDesenhista.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await HQDesenhista.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: HQ,
          as: "hq"
        },
        {
          model: Desenhista,
          as: "desenhista"
        }
      ]
    });
  }

  static async findById(id: number) {
    const relacao = await HQDesenhista.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "hq"
        },
        {
          model: Desenhista,
          as: "desenhista"
        }
      ]
    });

    if (!relacao) {
      throw new Error("Relação HQ-Desenhista não encontrada");
    }

    return relacao;
  }

  static async update(id: number, data: HQDesenhistaAttributes) {
    const relacao = await this.findById(id);
    return await relacao.update(data);
  }

  static async delete(id: number) {
    const relacao = await this.findById(id);
    await relacao.destroy();

    return { message: "Relação deletada com sucesso" };
  }
}