import Autor from "../models/autor";
import HQ from "../models/hq";
import { AutorAttributes } from "../types/autor.types";

export default class AutorService {

  static async create(data: AutorAttributes) {
    return await Autor.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await Autor.findAndCountAll({
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
    const autor = await Autor.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "hq",
          through: { attributes: [] }
        }
      ]
    });

    if (!autor) {
      throw new Error("Autor não encontrado");
    }

    return autor;
  }

  static async update(id: number, data: AutorAttributes) {
    const autor = await this.findById(id);
    return await autor.update(data);
  }

  static async delete(id: number) {
    const autor = await this.findById(id);
    await autor.destroy();

    return { message: "Autor deletado com sucesso" };
  }
}