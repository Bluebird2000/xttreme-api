import { afterMethod, beforeMethod, onException } from "kaop-ts";
import { IActivityModel } from "../models/activity";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { IsNumberString } from "class-validator";
import { isNumber } from "util";
import crypto = require("crypto");
import * as cron from "node-cron";
// import { URLSearchParams } from 'url';
import axios from 'axios';
import * as dotenv from 'dotenv';
dotenv.config();

export const sha256 = (data): any => {
  return crypto
    .createHash("sha256")
    .update(data, "utf8")
    .digest("base64");
}


export const handleException = (): any =>
  onException(meta => {
    let response = meta.args[1];
    sendResponse(new BasicResponse(Status.ERROR), response);
  });


function isMissing(param) {
  return !param;
}


function isNotANumber(param) {
  return !(IsNumberString(param) || isNumber(param));
}



export const simpleList = (schemaName: string): any =>
  afterMethod(async meta => {
    let request = meta.args[0];
    let response = meta.args[1];
    let next = meta.args[2];

    const managementId = request.app.locals.userobj.managementId;

    let offset = request.query.offset;
    let limit = request.query.limit;

    if (isMissing(offset) || isNotANumber(offset)) {
      offset = 0;
    }

    if (isMissing(limit) || isNotANumber(limit)) {
      limit = 50;
    }

    let skip = offset * limit;
    let count = 0;
    await request.app.locals[schemaName].count({ managementId: managementId }).then(result => { count = result });

    let base;
      base = request.app.locals[schemaName].find({ managementId: managementId })
    
    base
      .skip(skip)
      .limit(parseInt(limit))
      .sort([['createdAt', -1]])
      .then(result => {
        if (!result) {
          sendResponse(new BasicResponse(Status.ERROR), response);
          return next();
        } else {
          sendResponse(
            new BasicResponse(Status.SUCCESS, result, count),
            response
          );
          return next();
        }
      })
      .catch(err => {
        sendResponse(new BasicResponse(Status.ERROR, err), response);
        return next();
      });
  });

  export const singleList = (schemaName: string): any =>
  afterMethod(async meta => {
    let request = meta.args[0];
    let response = meta.args[1];
    let next = meta.args[2];

    const managementId = request.app.locals.userobj.managementId;

    let offset = request.query.offset;
    let limit = request.query.limit;

    if (isMissing(offset) || isNotANumber(offset)) {
      offset = 0;
    }

    if (isMissing(limit) || isNotANumber(limit)) {
      limit = 50;
    }

    let skip = offset * limit;
    let count = 0;
    await request.app.locals[schemaName]
      .count({ _id: request.params.id, managementId })
      .then(result => {
        count = result;
      });

    let base;
      base = request.app.locals[schemaName].find({ _id: request.params.id, managementId })
    base
      .skip(skip)
      .limit(parseInt(limit))
      .sort([['createdAt', -1]])
      .then(result => {
        if (!result) {
          sendResponse(new BasicResponse(Status.NOT_FOUND), response);
          return next();
        }else if(result.length === 0) {
          sendResponse(new BasicResponse(Status.NOT_FOUND), response);
        return next();
        } else {
          sendResponse(
            new BasicResponse(Status.SUCCESS, result),
            response
          );
          return next();
        }
      })
      .catch(err => {
        sendResponse(new BasicResponse(Status.NOT_FOUND), response);
        return next();
      });
  });


export const list = (schemaName: string): any =>
  afterMethod(async meta => {
    let request = meta.args[0];
    let response = meta.args[1];
    let next = meta.args[2];

    let tenantId = request.app.locals.userobj.organisationId;

    let model = request.app.locals[schemaName];

    let offset = request.query.offset;
    let limit = request.query.limit;

    if (isMissing(offset) || isNotANumber(offset)) offset = 0;

    if (isMissing(limit) || isNotANumber(limit)) {
      limit = 50;
    }

    let skip = offset * limit;
    let count = 0;
    let query = { tenantId: tenantId }
    await model.countDocuments(query).then(result => {
      count = result;
    });

    model
      .find(query).populate('category').populate('properties.id').populate('requisitionCartItems.itemId').populate('item_object_data.itemId').populate('product_id')
      .skip(skip)
      .limit(parseInt(limit))
      .sort([['createdAt', -1]])
      .then(result => {
        if (!result) {
          sendResponse(new BasicResponse(Status.ERROR), response);
          return next();
        } else {
          sendResponse(
            new BasicResponse(Status.SUCCESS, result, count),
            response
          );
          return next();
        }
      })
      .catch(err => {
        sendResponse(new BasicResponse(Status.ERROR, err), response);
        return next();
      });
  });



  export const trailUpdatedRecord = (schemaName: string): any =>
  afterMethod( meta => {

    let request = meta.args[0];
    let response = meta.args[1];
    let next = meta.args[2];

    let userInfo = request.app.locals.userobj;

    let description = `${userInfo.firstname} ${userInfo.lastname} updated a record`;
    let modelInstance = request.app.locals[schemaName];

    let previousEntity = null;
     modelInstance.findById(request.params.id).then(result => {
      previousEntity = result;
    });

    meta.result.then(model => {
      model.save().then(async entity => {
        if (entity) {
          saveActivity(description, schemaName, previousEntity.secret, entity.secret, "update", request);
          sendResponse(new BasicResponse(Status.SUCCESS, entity), response);
          return next();
        } else {
          sendResponse(new BasicResponse(Status.ERROR, entity), response);
          return next();
        }
      });
    });
  });


export const trailNewRecord = (schemaName: string): any =>
  afterMethod(meta => {
    let request = meta.args[0];
    let response = meta.args[1];
    let next = meta.args[2];
    let userInfo = request.app.locals.userobj;
    let description = `${userInfo.firstname} ${userInfo.lastname} added a new record`;
    meta.result.then(model => {
      console.log('inside model', model);
      model.save().then(entity => {
        console.log('inside entity', entity);
        if (entity) {
          saveActivity(description, schemaName, null, entity.secret, "create", request);

          sendResponse(new BasicResponse(Status.CREATED, entity), response);
          return next();
        } else {
          sendResponse(new BasicResponse(Status.ERROR, entity), response);
          return next();
        }
      });
    });
  });



async function saveActivity(description, schemaName, previousEntity, newEntity, actionType: string, request) {
  let userInfo = request.app.locals.userobj;
  let userId = userInfo.userId;
  let tenantId = userInfo.organisationId;

  let secret = { description, actionType, previousEntity, newEntity };
  let activity: IActivityModel = request.app.locals.activity({schemaName, secret, userId, tenantId});
  activity.save();
  return activity;
}

async function saveRequisitionActivity(description, schemaName, previousEntity, newEntity, actionType: string, request) {
  let userInfo = request.app.locals.userobj;
  let userId = userInfo.userId;
  let tenantId = userInfo.organisationId;

  let secret = { description, actionType, previousEntity, newEntity };
  let activity: IActivityModel = request.app.locals.activity({schemaName, secret, userId, tenantId});
  activity.save();
  return activity;
}

function sendResponse(serviceResponse: BasicResponse, responseObj): any {
  let clientResponse = {
    status: serviceResponse.getStatusString(),
    data: serviceResponse.getData(),
    recordCount: serviceResponse.getCount()
  };

  responseObj.status(getHttpStatus(serviceResponse.getStatusString()));

  console.log("responding with", clientResponse);
  responseObj.json(clientResponse);
}

function getHttpStatus(status: string): number {
  switch (status) {
    case "SUCCESS":
      return 200;
    case "CREATED":
      return 201;
    case "FAILED_VALIDATION":
      return 400;
    case "NOT_FOUND":
      return 404;
    default:
      return 500;
  }
}
