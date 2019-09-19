import { NextFunction, Request, Response, Router } from "express";
import { BaseController } from "./basecontroller";
import { AuthService } from '../services/AuthService';
import { CategoryService } from '../services/CategoryService';
import { ItemService } from "../services/ItemService";

export class XttremeInventoryController extends BaseController {
  public loadRoutes(prefix: String, router: Router) {
    this.registerUser(prefix, router);
    this.confirmUser(prefix, router);
    this.resendEmailConfirmationLink(prefix, router);
    this.resetPassword(prefix, router);
    this.sendResetPasswordLink(prefix, router);
    this.loginUser(prefix, router);
    this.createInventoryCategory(prefix, router);
    this.listInventoryCategories(prefix, router);
    this.getCategoryById(prefix, router);
    this.updateCategoryById(prefix, router);
    this.addNewItem(prefix, router);
    this.listItems(prefix, router);
    this.updateItemById(prefix, router);
    this.approveItem(prefix, router);
    this.listRoles(prefix, router);
  }


  public listRoles(prefix: String, router: Router): any {
    router.get(prefix + "/user/roles", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().listRoles(req, res, next);
    });
  }

  public registerUser(prefix: String, router: Router): any {
    router.post(prefix + "/auth/register", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().registerUser(req, res, next);
    });
  }


  public confirmUser(prefix: String, router: Router): any {
    router.post(prefix + "/auth/confirmation", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().confirmUser(req, res, next);

    });
  }


  public resendEmailConfirmationLink(prefix: String, router: Router): any {
    router.post(prefix + "/auth/resend", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().resendEmailConfirmationLink(req, res, next);

    });
  }


  public resetPassword(prefix: String, router: Router): any {
    router.post(prefix + "/auth/reset_password", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().processResetPassword(req, res, next);
    });
  }

  public sendResetPasswordLink(prefix: String, router: Router): any {
    router.post(prefix + "/auth/send_link", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().sendResetPasswordLink(req, res, next);
    });
  }


  public loginUser(prefix: String, router: Router): any {
    router.post(prefix + "/auth/login", (req: Request, res: Response, next: NextFunction) => {
      new AuthService().loginUser(req, res, next);
    });
  }


  public createInventoryCategory(prefix: String, router: Router): any {
    router.post(prefix + "/category", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => {
        new CategoryService().createInventoryCategory(req, res, next, this.user_id, this.user_managementId
        );
      }
    );
  }


  public listInventoryCategories(prefix: String, router: Router): any {
    router.get(prefix + "/category", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => { new CategoryService().listInventoryCategories( req, res, next, this.user_id,this.user_managementId
        );
      }
    );
  }


  public getCategoryById(prefix: String, router: Router): any {
    router.get(prefix + "/category/:id", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => { new CategoryService().getCategoryById( req, res, next, this.user_id,this.user_managementId
        );
      }
    );
  } 


  public updateCategoryById(prefix: String, router: Router): any {
    router.put( prefix + "/category/:id", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => { new CategoryService().updateCategoryById( req, res, next, this.user_id,this.user_managementId
        );
      }
    );
  } 


  public addNewItem(prefix: String, router: Router): any {
    router.post(prefix + "/item", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => { new ItemService().addNewItem(req, res, next, this.user_id, this.user_managementId
        );
      }
    );
  }


  public listItems(prefix: String, router: Router): any {
    router.get(prefix + "/item", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => { new ItemService().listItems( req, res, next, this.user_id,this.user_managementId
        );
      }
    );
  }

  public updateItemById(prefix: String, router: Router): any {
    router.put( prefix + "/item/:id", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => { new ItemService().updateItemById( req, res, next, this.user_id, this.user_managementId
        );
      }
    );
  } 

  public approveItem(prefix: String, router: Router): any {
    router.patch( prefix + "/item/approve/:id", [this.authorize.bind(this)], (req: Request, res: Response, next: NextFunction) => { new ItemService().approveItem( req, res, next, this.user_id, this.user_managementId
        );
      }
    );
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
