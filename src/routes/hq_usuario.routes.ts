import { Router } from "express";
import HQUsuarioController from "../controllers/hq_usuario.controllers";

const router = Router();

router.post("/", HQUsuarioController.create);
router.get("/", HQUsuarioController.findAll);
router.get("/:id", HQUsuarioController.findOne);
router.put("/:id", HQUsuarioController.update);
router.delete("/:id", HQUsuarioController.delete);

export default router;