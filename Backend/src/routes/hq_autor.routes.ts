import { Router } from "express";
import HQAutorController from "../controllers/hq_autor.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, HQAutorController.create);
router.get("/", HQAutorController.findAll);
router.get("/:id", HQAutorController.findOne);
router.put("/:id", authMiddleware, HQAutorController.update);
router.delete("/:id", authMiddleware, HQAutorController.delete);

export default router;