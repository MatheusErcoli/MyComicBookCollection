import { Op } from "sequelize";
import { sequelize } from "../database";
import Editora from "../models/editora";
import HQ from "../models/hq";
import HQUsuario from "../models/hq_usuario";
import { HQUsuarioStatus } from "../types/hq_usuario.types";

export default class DashboardService {
  static async index(userId: number) {
    const raw = await HQUsuario.findAll({
      where: {
        usuario_id: userId,
      },
      attributes: [
        "status",
        [sequelize.fn("COUNT", "*"), "total"],
      ],
      group: ["status"],
      raw: true,
    });

    const totalHQs = await HQUsuario.count({
      where: {
        usuario_id: userId,
      },
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

    const statusPossuidos = [
      HQUsuarioStatus.NAO_LIDA,
      HQUsuarioStatus.LENDO,
      HQUsuarioStatus.LIDA,
    ];

    const totaisFinanceiros = await HQUsuario.findAll({
      where: {
        usuario_id: userId,
        status: { [Op.in]: statusPossuidos },
      },
      include: [
        {
          model: HQ,
          as: "hq",
          attributes: [],
        },
      ],
      attributes: [
        [sequelize.fn("SUM", sequelize.col("hq.valor")), "valorColecao"],
        [sequelize.fn("SUM", sequelize.col("hq.valor_pago")), "totalInvestido"],
      ],
      raw: true,
    });

    const valorColecao = Number((totaisFinanceiros[0] as any)?.valorColecao ?? 0);
    const totalInvestido = Number(
      (totaisFinanceiros[0] as any)?.totalInvestido ?? 0
    );

    const ultimasAdicionadas = await HQUsuario.findAll({
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
      limit: 5,
    });

    return {
      totalHQs,
      ...formatado,
      valorColecao,
      totalInvestido,
      ultimasAdicionadas,
    };
  }
}