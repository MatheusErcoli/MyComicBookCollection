import { Router } from "express";
import EditoraController from "../controllers/editora.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";


const router = Router();

router.post("/", authMiddleware, EditoraController.create);
router.get("/", EditoraController.findAll);
router.get("/:id", EditoraController.findOne);
router.put("/:id", authMiddleware, EditoraController.update);
router.delete("/:id", authMiddleware, EditoraController.delete);

export default router;