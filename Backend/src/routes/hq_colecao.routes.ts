import { Router } from "express";
import HQColecaoController from "../controllers/hq_colecao.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, HQColecaoController.create);
router.get("/", HQColecaoController.findAll);
router.get("/:id", HQColecaoController.findOne);
router.put("/:id", authMiddleware, HQColecaoController.update);
router.delete("/:id", authMiddleware, HQColecaoController.delete);

export default router;