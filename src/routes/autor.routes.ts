import { Router } from "express";
import AutorController from "../controllers/autor.controllers";

const router = Router();

router.post("/", AutorController.create);
router.get("/", AutorController.findAll);
router.get("/:id", AutorController.findOne);
router.put("/:id", AutorController.update);
router.delete("/:id", AutorController.delete);

export default router;