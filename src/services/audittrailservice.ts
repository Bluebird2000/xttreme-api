import { BaseService } from "./BaseService";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { NextFunction, Request, Response } from "express";


export class AuditTrailService extends BaseService {

    public async listTrail(req: Request, res: Response, next: NextFunction, userId: string, managementId: string) {

        req.app.locals.activity.find({ managementId: managementId }).sort({ createdAt: 'descending' }).limit(30).then(result => {

            if (!result) {
                this.sendResponse(new BasicResponse(Status.NOT_FOUND), res)
            } else {
                this.sendResponse(new BasicResponse(Status.SUCCESS, result), res)
            }
        }).catch(err => {
            this.sendResponse(new BasicResponse(Status.ERROR, err), res);
        });
    }

}