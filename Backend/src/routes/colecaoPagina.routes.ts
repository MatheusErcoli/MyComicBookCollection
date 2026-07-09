import { Router } from "express";
import CollectionController from "../controllers/colecaoPagina.controllers";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authMiddleware,
  CollectionController.index
);

export default router;