import { Router } from "express";
import ColecaoController from "../controllers/colecao.controllers";

const router = Router();

router.post("/", ColecaoController.create);
router.get("/", ColecaoController.findAll);
router.get("/:id", ColecaoController.findOne);
router.put("/:id", ColecaoController.update);
router.delete("/:id", ColecaoController.delete);

export default router;