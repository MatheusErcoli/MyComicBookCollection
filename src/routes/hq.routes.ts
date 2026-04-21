import { Router } from "express";
import HQController from "../controllers/hq.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, HQController.create);
router.get("/", HQController.findAll);
router.get("/:id", HQController.findOne);
router.put("/:id", authMiddleware, HQController.update);
router.delete("/:id", authMiddleware, HQController.delete);

export default router;