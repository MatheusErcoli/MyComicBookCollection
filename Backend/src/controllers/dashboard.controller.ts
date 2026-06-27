import { Request, Response, NextFunction } from "express";
import DashboardService from "../services/dashboard.services";

export default class DashboardController {

  static async index(req: any, res: Response, next: NextFunction) {
    try {
      const dashboard = await DashboardService.index(req.userId);

      return res.json(dashboard);
    } catch (error) {
      next(error);
    }
  }

}