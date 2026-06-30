import { Router } from "express";

import hqRoutes from "./hq.routes";
import usuarioRoutes from "./usuario.routes";
import autorRoutes from "./autor.routes";
import desenhistaRoutes from "./desenhista.routes";
import editoraRoutes from "./editora.routes";
import colecaoRoutes from "./colecao.routes";

import hqAutorRoutes from "./hq_autor.routes";
import hqDesenhistaRoutes from "./hq_desenhista.routes";
import hqColecaoRoutes from "./hq_colecao.routes";
import hqUsuarioRoutes from "./hq_usuario.routes";
import dashboardRoutes from "./dashboard.routes";
import UsuarioController from "../controllers/usuario.controllers";
import colecaoPaginaRoutes from "./colecaoPagina.routes";
import cors from "cors";

const router = Router();



router.use("/hq", hqRoutes);
router.use("/usuario", usuarioRoutes);
router.use("/autor", autorRoutes);
router.use("/desenhista", desenhistaRoutes);
router.use("/editora", editoraRoutes);
router.use("/colecao", colecaoRoutes);

router.use("/hq-autor", hqAutorRoutes);
router.use("/hq-desenhista", hqDesenhistaRoutes);
router.use("/hq-colecao", hqColecaoRoutes);
router.use("/hq-usuario", hqUsuarioRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/minha-colecao", colecaoPaginaRoutes)
router.post("/login", UsuarioController.login);

export default router;
