import { Router } from "express";
import HQController from "../controllers/hq.controllers";

const router = Router();

router.post("/", HQController.create);
router.get("/", HQController.findAll);
router.get("/:id", HQController.findOne);
router.put("/:id", HQController.update);
router.delete("/:id", HQController.delete);

export default router;