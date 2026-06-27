import HQUsuario from "../models/hq_usuario";
import { HQUsuarioStatus } from "../types/hq_usuario.types";
import { sequelize } from "../database";

export default class DashboardService {

  static async index(userId: number) {

    const raw = await HQUsuario.findAll({
      where: {
        usuario_id: userId,
      },
      attributes: [
        "status",
        [sequelize.fn("COUNT", "*"), "total"]
      ],
      group: ["status"],
      raw: true,
    });

    const totalHQs = await HQUsuario.count({
      where: { usuario_id: userId }
    });

    const formatado = {
      lidas: 0,
      lendo: 0,
      naoLidas: 0,
      wishlist: 0,
    };

    raw.forEach((item: any) => {
      switch (item.status) {
        case HQUsuarioStatus.LIDA:
          formatado.lidas = Number(item.total);
          break;

        case HQUsuarioStatus.LENDO:
          formatado.lendo = Number(item.total);
          break;

        case HQUsuarioStatus.NAO_LIDA:
          formatado.naoLidas = Number(item.total);
          break;

        case HQUsuarioStatus.WISHLIST:
          formatado.wishlist = Number(item.total);
          break;
      }
    });

    return {
      totalHQs,
      ...formatado,
    };
  }
}