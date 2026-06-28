import { Request, Response } from "express";
import Volume from "../models/volume";

class VolumeController {
    async create(req: Request, res: Response): Promise<void> {
        try {
            const { numero_volume, titulo, ano_publicacao } = req.body;

            const volume = await Volume.create({
                numero_volume,
                titulo,
                ano_publicacao,
            });

            res.status(201).json(volume);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao criar volume",
            });
        }
    }

    async findAll(req: Request, res: Response): Promise<void> {
        try {
            const volumes = await Volume.findAll({
                order: [
                    ["titulo", "ASC"],
                    ["numero_volume", "ASC"],
                ],
            });

            res.status(200).json(volumes);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao buscar volumes",
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

            const volume = await Volume.findByPk(id);

            if (!volume) {
                res.status(404).json({
                    message: "Volume não encontrado",
                });
                return;
            }

            res.status(200).json(volume);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao buscar volume",
            });
        }
    }

    async update(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (isNaN(id)) {
                res.status(400).json({
                    message: "ID inválido",
                });
                return;
            }

            const volume = await Volume.findByPk(id);

            if (!volume) {
                res.status(404).json({
                    message: "Volume não encontrado",
                });
                return;
            }

            const {
                numero_volume,
                titulo,
                ano_publicacao,
            } = req.body;

            await volume.update({
                numero_volume,
                titulo,
                ano_publicacao,
            });

            res.status(200).json(volume);
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao atualizar volume",
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

            const volume = await Volume.findByPk(id);

            if (!volume) {
                res.status(404).json({
                    message: "Volume não encontrado",
                });
                return;
            }

            await volume.destroy();

            res.status(200).json({
                message: "Volume removido com sucesso",
            });
        } catch (error) {
            console.error(error);

            res.status(500).json({
                message: "Erro ao remover volume",
            });
        }
    }
}

export default new VolumeController();