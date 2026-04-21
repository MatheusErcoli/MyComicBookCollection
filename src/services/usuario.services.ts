import Usuario from "../models/usuario";
import HQ from "../models/hq";
import Autor from "../models/autor";
import Desenhista from "../models/desenhista";
import Editora from "../models/editora";
import Colecao from "../models/colecao";

export default class UsuarioService {

  static async create(data: any) {
    return await Usuario.create(data);
  }

  static async findAll(limit: number, offset: number) {
    return await Usuario.findAndCountAll({
      limit,
      offset,
      order: [["id", "DESC"]],
      include: [
        {
          model: HQ,
          as: "minha_colecao",
          through: { attributes: [] },
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
            }
          ]
        }
      ]
    });
  }

  static async findById(id: number) {
    const usuario = await Usuario.findByPk(id, {
      include: [
        {
          model: HQ,
          as: "minha_colecao",
          through: { attributes: [] },
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
            }
          ]
        }
      ]
    });

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    return usuario;
  }

  static async update(id: number, data: any) {
    const usuario = await this.findById(id);
    return await usuario.update(data);
  }

  static async delete(id: number) {
    const usuario = await this.findById(id);
    await usuario.destroy();

    return { message: "Usuário deletado com sucesso" };
  }
}