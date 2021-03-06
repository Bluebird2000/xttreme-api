import { BaseService } from "./BaseService";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { NextFunction, Request, Response } from "express";
import { IInventoryCategoryModel } from "../models/category";
import { CreateInventoryCategoryDTO } from "../dto/input/createcategorydto";
import { UpdateCategoryDTO } from "../dto/input/updatecategorydto";
import { validateSync, validate } from "class-validator";
import { trailNewRecord, handleException, simpleList, singleList, trailUpdatedRecord } from "../aspects/historytrail";
import { Types } from "mongoose";

export class CategoryService extends BaseService {
  @handleException()
  public async createInventoryCategory( req: Request, res: Response, next: NextFunction, userId: string, managementId: string) {
    const { description } = req.body;
    let name: string;
    if(req.body.name){
      name = req.body.name.trim().split(/\s+/).join(" ");
    } else { name = req.body.name } 
    
    let dto = new CreateInventoryCategoryDTO(name, description);

    let errors = await this.validateNewInvCategoryDetails(dto, req, managementId);
    if (this.hasErrors(errors)) {
      this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
      return next();
    }
    await this.saveNewCategoryData(req, res, next, userId, managementId, dto);
  }

  hasErrors(errors) {
      return !(errors === undefined || errors.length == 0);
  }
  
  
  async saveNewCategoryData(req: Request, res: Response, next: NextFunction,  userId: string, managementId: string, dto: CreateInventoryCategoryDTO) {
      const { name, description } = dto;
      const secret = { name, description };
      let category: IInventoryCategoryModel = req.app.locals.category({ secret, userId, managementId, nameHash: this.sha256(name) });
      let responseObj = null;
      await category.save().then(async result => {
          if (result) {
            this.sendResponse(new BasicResponse(Status.CREATED, result), res);
          } else {
            responseObj = new BasicResponse(Status.FAILED_VALIDATION);
          }
      }).catch(err => {
          responseObj = new BasicResponse(Status.ERROR, err);
      });

      this.sendResponse(responseObj, res);
  }

  @simpleList('category')
  public async listInventoryCategories(req: Request, res: Response, next: NextFunction, userId: string, managementId: string)
  { }


  @singleList('category')
  public async getCategoryById(req: Request, res: Response, next: NextFunction, userId: string, managementId: string)
   { }


  @handleException()
  public async updateCategoryById(req: Request, res: Response, next: NextFunction, userId: string, managementId: string) {
     const { name, description } = req.body;
 
     let dto = new UpdateCategoryDTO(name, description);
 
       let errors = await this.validateNewInvCategoryDetails(dto, req, managementId);
       if (this.hasErrors(errors)) {
         this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
         return next();
       }
       await this.updateCategoryData(req, res, next, userId, managementId, dto);
   }
 
 @trailUpdatedRecord('category')
   async updateCategoryData(req: Request, res: Response, next:NextFunction,  userId: string, managementId: string, dto: UpdateCategoryDTO) {
    let existingCategory = null;
     await req.app.locals.category.findById(req.params.id).then(result => {
       if (result) {
        existingCategory = result;
       }
       else if (result.length === 0) {
         this.sendResponse(new BasicResponse(Status.NOT_FOUND), res);
       }
     }).catch(err => {
       this.sendResponse(new BasicResponse(Status.NOT_FOUND), res);
       
     });
 
     existingCategory.secret.name = dto.name;
     existingCategory.nameHash = this.sha256(dto.name);
     existingCategory.secret.description = dto.description;
     existingCategory.lastUpdatedAt = new Date()

     return existingCategory;
 
   }
  

   
  async validateNewInvCategoryDetails(dto: CreateInventoryCategoryDTO, req: Request, managementId: string) {

      let errors = validateSync(dto, { validationError: { target: false } });
      if (this.hasErrors(errors)) {
        return errors;
      }
  
      await req.app.locals.category.find({ nameHash: this.sha256(req.body.name), managementId }).then(result => {
        if (result && result[0] && result[0]._id && result[0]._id != req.params.id) {
          errors.push(this.getDuplicateNameError(dto.name));
        } else if (result && result[0] && result[0]._id && !req.params.id) {
          errors.push(this.getDuplicateNameError(dto.name));
        }
      });
      return errors;
    }    


}