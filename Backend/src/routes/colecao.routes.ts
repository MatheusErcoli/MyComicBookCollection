import { Router } from "express";
import ColecaoController from "../controllers/colecao.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, ColecaoController.create);
router.get("/", ColecaoController.findAll);
router.get("/:id", ColecaoController.findOne);
router.put("/:id", authMiddleware, ColecaoController.update);
router.delete("/:id", authMiddleware, ColecaoController.delete);

export default router;