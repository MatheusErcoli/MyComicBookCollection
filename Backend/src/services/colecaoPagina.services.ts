import Autor from "../models/autor";
import Editora from "../models/editora";
import HQ from "../models/hq";
import HQUsuario from "../models/hq_usuario";

export default class CollectionService {
  static async index(
    userId: number,
    limit: number,
    offset: number
  ) {
    const { count, rows } = await HQUsuario.findAndCountAll({
      where: {
        usuario_id: userId,
      },
      include: [
        {
          model: HQ,
          as: "hq",
          attributes: [
            "id",
            "titulo",
            "numero_edicao",
            "capa_url",
            "valor_pago",
          ],
          include: [
            {
              model: Editora,
              as: "editora",
              attributes: ["id", "nome"],
            },
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
    });

    const editoras = await Editora.findAll({
      attributes: ["id", "nome"],
      order: [["nome", "ASC"]],
    });

    const autores = await Autor.findAll({
      attributes: ["id", "nome"],
      order: [["nome", "ASC"]],
    });

    return {
      count,
      rows,
      editoras,
      autores,
    };
  }
}