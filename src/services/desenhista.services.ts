import Desenhista from "../models/desenhista";
import HQ from "../models/hq";

export default class DesenhistaService {

  static async create(data: any) {
    return await Desenhista.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await Desenhista.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: HQ,
          as: "hq",
          through: { attributes: [] }
        }
      ]
    });
  }

  static async findById(id: number) {
    const desenhista = await Desenhista.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "hq",
          through: { attributes: [] }
        }
      ]
    });

    if (!desenhista) {
      throw new Error("Desenhista não encontrado");
    }

    return desenhista;
  }

  static async update(id: number, data: any) {
    const desenhista = await this.findById(id);
    return await desenhista.update(data);
  }

  static async delete(id: number) {
    const desenhista = await this.findById(id);
    await desenhista.destroy();

    return { message: "Desenhista deletado com sucesso" };
  }
}