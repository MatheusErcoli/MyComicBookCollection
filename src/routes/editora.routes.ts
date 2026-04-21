import { Router } from "express";
import EditoraController from "../controllers/editora.controllers";


const router = Router();

router.post("/", EditoraController.create);
router.get("/", EditoraController.findAll);
router.get("/:id", EditoraController.findOne);
router.put("/:id", EditoraController.update);
router.delete("/:id", EditoraController.delete);

export default router;