import HQUsuario from "../models/hq_usuario";

export default class CollectionService {
  static async index(userId: number) {
    const hqs = await HQUsuario.findAll({
      where: {
        usuario_id: userId,
      },
      order: [["createdAt", "DESC"]],
    });

    return hqs;
  }
}