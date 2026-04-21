import { Router } from "express";
import HQDesenhistaController from "../controllers/hq_desenhista.controllers";

const router = Router();

router.post("/", HQDesenhistaController.create);
router.get("/", HQDesenhistaController.findAll);
router.get("/:id", HQDesenhistaController.findOne);
router.put("/:id", HQDesenhistaController.update);
router.delete("/:id", HQDesenhistaController.delete);

export default router;