import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import { BasicResponse } from "../dto/output/basicresponse";
import * as dotenv from 'dotenv';
dotenv.config();
/**
 * Constructor
 *
 * @class BaseController
 */
export class BaseController {

  protected systemErrorMsg: object = { "message": "Sorry your request could not be completed at the moment" };
  protected invalidCredentials: object = { 'message': 'Invalid Credentials' };
  protected notAuthorized: object = { 'message': 'You are not authorized to access this resource' };
  protected itemNotFound: object = { 'message': 'Not found' };
  protected noResults: object = { 'message': 'No results available' };
  protected start: number = 0;
  protected limit: number = 20;

  protected user_firstname = null;
  protected user_lastname = null;
  protected user_email = null;
  protected user_managementId = null;
  protected user_id = null;


  protected initPagination(req: Request, post: boolean) {
    let obj: any = post ? req.body : req.query;

    if (obj.start && !isNaN(obj.start)) {
      this.start = +obj.start;
    }
    if (obj.limit && !isNaN(obj.limit)) {
      this.limit = +obj.limit;
    }

  }


  protected sendResponse(serviceResponse: BasicResponse, req: Request, res: Response, next: NextFunction): any {
    let response = {
      status: serviceResponse.getStatusString(),
      data: serviceResponse.getData()
    }

    res.status(this.getHttpStatus(serviceResponse.getStatusString()));

    console.log('responding with', response);
    res.json(response);
    next();
  }

  private getHttpStatus(status: string): number {
    switch (status) {
      case 'SUCCESS':
        return 200;
      case 'CREATED':
        return 201;
      case 'FAILED_VALIDATION':
        return 400;
      case 'UNATHORIZED':
        return 401;
      default:
        return 500;
    }
  }
  protected sendError(req: Request, res: Response, next: NextFunction, data?: Object) {

    let dat = {
      status: 400,
      data: data
    }
    res.status(401);
    res.send(dat);

    return next();
  }

  protected authorized(req: Request, res: Response, next: NextFunction): boolean {
    let token = (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') ? req.headers.authorization.split(' ')[1] : null;
    if (token === null) {
      console.log('cant find header');
      return false;
    }

    try {
      const secret = process.env.USER_JWT_SECRET;
      let user: any = verify(token, secret);
      console.log('Base controller', user);
      this.setUserVariables(user)
      return true;

    } catch (err) {
      console.log(err);
      return false;
    }

  }

  protected setUserVariables(user) {
    this.user_firstname = user.firstName;
    this.user_lastname = user.lastName;
    this.user_email = user.email;
    this.user_managementId = user.managementId;
    this.user_id = user.userId;
  }

}

