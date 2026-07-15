import { Op, WhereOptions } from "sequelize";
import Autor from "../models/autor";
import Editora from "../models/editora";
import HQ from "../models/hq";
import HQUsuario from "../models/hq_usuario";

export interface CollectionFiltros {
  status?: string;
  search?: string;
  editoraId?: number;
  autorId?: number;
}

export default class CollectionService {
  static async index(
    userId: number,
    limit: number,
    offset: number,
    filtros: CollectionFiltros = {}
  ) {
    const { status, search, editoraId, autorId } = filtros;

    const whereHQUsuario: WhereOptions = {
      usuario_id: userId,
      ...(status ? { status } : {}),
    };

    const whereHQ: WhereOptions = {
      ...(search ? { titulo: { [Op.like]: `%${search}%` } } : {}),
      ...(editoraId ? { editora_id: editoraId } : {}),
    };

    const { count, rows } = await HQUsuario.findAndCountAll({
      where: whereHQUsuario,
      include: [
        {
          model: HQ,
          as: "hq",
          where: whereHQ,
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
            ...(autorId
              ? [
                  {
                    model: Autor,
                    as: "autor",
                    attributes: [] as string[],
                    where: { id: autorId },
                    through: { attributes: [] as string[] },
                  },
                ]
              : []),
          ],
        },
      ],
      order: [["created_at", "DESC"]],
      limit,
      offset,
      distinct: true,
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