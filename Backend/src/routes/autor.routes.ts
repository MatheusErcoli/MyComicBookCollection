import { Router } from "express";
import AutorController from "../controllers/autor.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, AutorController.create);
router.get("/", AutorController.findAll);
router.get("/:id", AutorController.findOne);
router.put("/:id", authMiddleware, AutorController.update);
router.delete("/:id", authMiddleware, AutorController.delete);

export default router;