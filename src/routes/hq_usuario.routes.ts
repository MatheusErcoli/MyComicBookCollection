import { Router } from "express";
import HQUsuarioController from "../controllers/hq_usuario.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, HQUsuarioController.create);
router.get("/", HQUsuarioController.findAll);
router.get("/:id", HQUsuarioController.findOne);
router.put("/:id", authMiddleware, HQUsuarioController.update);
router.delete("/:id", authMiddleware, HQUsuarioController.delete);

export default router;