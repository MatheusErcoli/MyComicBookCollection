import { Router } from "express";
import DesenhistaController from "../controllers/desenhista.controllers";

const router = Router();

router.post("/", DesenhistaController.create);
router.get("/", DesenhistaController.findAll);
router.get("/:id", DesenhistaController.findOne);
router.put("/:id", DesenhistaController.update);
router.delete("/:id", DesenhistaController.delete);

export default router;