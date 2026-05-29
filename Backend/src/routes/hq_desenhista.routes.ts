import { Router } from "express";
import HQDesenhistaController from "../controllers/hq_desenhista.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, HQDesenhistaController.create);
router.get("/", HQDesenhistaController.findAll);
router.get("/:id", HQDesenhistaController.findOne);
router.put("/:id", authMiddleware, HQDesenhistaController.update);
router.delete("/:id", authMiddleware, HQDesenhistaController.delete);

export default router;