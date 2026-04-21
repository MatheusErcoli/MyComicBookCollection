import { Router } from "express";
import DesenhistaController from "../controllers/desenhista.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, DesenhistaController.create);
router.get("/", DesenhistaController.findAll);
router.get("/:id", DesenhistaController.findOne);
router.put("/:id", authMiddleware, DesenhistaController.update);
router.delete("/:id", authMiddleware, DesenhistaController.delete);

export default router;