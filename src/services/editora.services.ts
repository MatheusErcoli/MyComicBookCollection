import Editora from "../models/editora";
import HQ from "../models/hq";

export default class EditoraService {

  static async create(data: any) {
    return await Editora.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await Editora.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: HQ,
          as: "hq"
        }
      ]
    });
  }

  static async findById(id: number) {
    const editora = await Editora.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "hq"
        }
      ]
    });

    if (!editora) {
      throw new Error("Editora não encontrada");
    }

    return editora;
  }

  static async update(id: number, data: any) {
    const editora = await this.findById(id);
    return await editora.update(data);
  }

  static async delete(id: number) {
    const editora = await this.findById(id);
    await editora.destroy();

    return { message: "Editora deletada com sucesso" };
  }
}