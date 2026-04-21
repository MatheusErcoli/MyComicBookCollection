import { Router } from "express";
import HQAutorController from "../controllers/hq_autor.controllers";

const router = Router();

router.post("/", HQAutorController.create);
router.get("/", HQAutorController.findAll);
router.get("/:id", HQAutorController.findOne);
router.put("/:id", HQAutorController.update);
router.delete("/:id", HQAutorController.delete);

export default router;