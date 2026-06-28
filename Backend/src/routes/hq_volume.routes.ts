import { Router } from "express";
import HQVolumeController from "../controllers/hq_volume.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, HQVolumeController.create);

router.get("/", authMiddleware, HQVolumeController.findAll);

router.get("/:id", authMiddleware, HQVolumeController.findById);

router.get("/hq/:hq_id", authMiddleware, HQVolumeController.findByHQ);

router.get("/volume/:volume_id", authMiddleware, HQVolumeController.findByVolume);

router.delete("/:id", authMiddleware, HQVolumeController.delete);

export default router;