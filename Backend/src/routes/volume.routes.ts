import { Router } from "express";
import VolumeController from "../controllers/volume.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, VolumeController.create);
router.get("/", authMiddleware, VolumeController.findAll);
router.get("/:id", authMiddleware, VolumeController.findById);
router.put("/:id", authMiddleware, VolumeController.update);
router.delete("/:id", authMiddleware, VolumeController.delete);

export default router;