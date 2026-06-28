import { Request, Response } from "express";
import HQVolume from "../models/hq_volume";

class HQVolumeController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { hq_id, volume_id } = req.body;

            const relacionamento = await HQVolume.create({
                hq_id,
                volume_id,
            });

            res.status(201).json(relacionamento);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao vincular HQ e Volume",
            });
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const relacionamentos = await HQVolume.findAll();

            res.status(200).json(relacionamentos);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao buscar relacionamentos",
            });
        }
    }

    async findById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    message: "ID inválido",
                });
                return;
            }

            const relacionamento = await HQVolume.findByPk(id);

            if (!relacionamento) {
                res.status(404).json({
                    message: "Relacionamento não encontrado",
                });
                return;
            }

            res.status(200).json(relacionamento);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao buscar relacionamento",
            });
        }
    }

    async delete(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    message: "ID inválido",
                });
                return;
            }

            const relacionamento = await HQVolume.findByPk(id);

            if (!relacionamento) {
                res.status(404).json({
                    message: "Relacionamento não encontrado",
                });
                return;
            }

            await relacionamento.destroy();

            res.status(200).json({
                message: "Relacionamento removido com sucesso",
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao remover relacionamento",
            });
        }
    }

    async findByHQ(req: Request, res: Response): Promise<void> {
        try {
            const hq_id = Number(req.params.hq_id);

            if (isNaN(hq_id)) {
                res.status(400).json({
                    message: "ID da HQ inválido",
                });
                return;
            }

            const volumes = await HQVolume.findAll({
                where: { hq_id },
            });

            res.status(200).json(volumes);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao buscar volumes da HQ",
            });
        }
    }

    async findByVolume(req: Request, res: Response): Promise<void> {
        try {
            const volume_id = Number(req.params.volume_id);

            if (isNaN(volume_id)) {
                res.status(400).json({
                    message: "ID do Volume inválido",
                });
                return;
            }

            const hqs = await HQVolume.findAll({
                where: { volume_id },
            });

            res.status(200).json(hqs);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao buscar HQs do volume",
            });
        }
    }
}

export default new HQVolumeController();