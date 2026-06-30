import { Router } from "express";
import CollectionController from "../controllers/colecaoPagina.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/minha-colecao",
  authMiddleware,
  CollectionController.index
);

export default router;