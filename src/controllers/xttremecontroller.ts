import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./basecontroller";
import { AuthService } from '../services/AuthService';



export class EnergyDashBoardController extends BaseController {

  public loadRoutes(prefix: String, router: Router) {
    this.registerUser(prefix, router);
  }


  public registerUser(prefix: String, router: Router): any {
    router.post(prefix + "/auth/register", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().registerUser(req, res, next);

    });
  }

  public authorize(req: Request, res: Response, next: NextFunction) {
    if (!this.authorized(req, res, next)) {
      this.sendError(req, res, next, this.notAuthorized);
    } else {
      next();
    }

  }

  constructor() {
    super();
  }
}
