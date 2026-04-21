import { Router } from "express";
import UsuarioController from "../controllers/usuario.controllers";

const router = Router();

router.post("/", UsuarioController.create);
router.get("/", UsuarioController.findAll);
router.get("/:id", UsuarioController.findOne);
router.put("/:id", UsuarioController.update);
router.delete("/:id", UsuarioController.delete);

export default router;