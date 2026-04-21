import { Router } from "express";
import HQColecaoController from "../controllers/hq_colecao.controllers";

const router = Router();

router.post("/", HQColecaoController.create);
router.get("/", HQColecaoController.findAll);
router.get("/:id", HQColecaoController.findOne);
router.put("/:id", HQColecaoController.update);
router.delete("/:id", HQColecaoController.delete);

export default router;