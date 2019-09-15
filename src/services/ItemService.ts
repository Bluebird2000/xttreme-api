import { BaseService } from "./BaseService";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { NextFunction, Request, Response } from "express";
import { IItemModel } from "../models/item";
import { CreateItemDTO } from "../dto/input/createitemdto";
import { validateSync } from "class-validator";
import { trailNewRecord, handleException, simpleList, trailUpdatedRecord } from "../aspects/historytrail";


export class ItemService extends BaseService {
  
@handleException()
  public async addNewItem( req: Request, res: Response, next: NextFunction, userId: string, managementId: string) {
    const { name, description, quantity, category, tag, reorder_level } = req.body;
    let dto = new CreateItemDTO(name, description, quantity, category, tag, reorder_level);

    let errors = await this.validateNewInventoryDetails(dto, req, managementId);
    if (this.hasErrors(errors)) {
      this.sendResponse( new BasicResponse(Status.FAILED_VALIDATION, errors), res);
      return next();
    }

    await this.saveNewItemData(req, res, next, userId, managementId, dto);
  }


  @trailNewRecord("item")
  async saveNewItemData(req: Request,res: Response, next: NextFunction, userId: string, managementId: string, dto: CreateItemDTO
  ) {
    let {name, description, quantity, category, tag, reorder_level } = dto;
    const secret = { name, description, quantity, reorder_level }
    let userInfo = req.app.locals.userobj;
    console.log(11,userInfo);
    userId = `${userInfo.firstName} ${userInfo.lastName}`;
    let item: IItemModel = req.app.locals.item({ secret, category, tag, userId, managementId, nameHash: this.sha256(name)});

    return item;
  
  }

  @simpleList('item')
  public async listItems(req: Request, res: Response, next: NextFunction, userId: string, managementId: string)
  { }


  @handleException()
  public async updateItemById(req: Request, res: Response, next: NextFunction, userId: string, managementId: string) {
     const { name, description, quantity, category, tag, reorder_level } = req.body;
 
     let dto = new CreateItemDTO(name, description, quantity, category, tag, reorder_level);
 
       let errors = await this.validateNewInventoryDetails(dto, req, managementId);
       if (this.hasErrors(errors)) {
         this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
         return next();
       }
       await this.updateItemData(req, res, next, userId, managementId, dto);
   }
 
   
 @trailUpdatedRecord('item')
   async updateItemData(req: Request, res: Response, next:NextFunction,  userId: string, managementId: string, dto: CreateItemDTO) {
    let existingItem = null;
    let userInfo = req.app.locals.userobj;
    userId = `${userInfo.firstname} ${userInfo.lastname}`;
     await req.app.locals.item.findById(req.params.id).then(result => {
       if (result) {
        existingItem = result;
       }
       else if (result.length === 0) {
         this.sendResponse(new BasicResponse(Status.NOT_FOUND), res);
       }
     }).catch(err => {
       this.sendResponse(new BasicResponse(Status.NOT_FOUND), res);
       
     });
 
     existingItem.secret.name = dto.name;
     existingItem.nameHash = this.sha256(dto.name);
     existingItem.secret.description = dto.description;
     existingItem.secret.quantity = dto.quantity;
     existingItem.category = dto.category;
     existingItem.tag = dto.tag;
     existingItem.secret.reorder_level = dto.reorder_level;
     existingItem.lastUpdatedAt = new Date()

     return existingItem;
 
   }


  async validateNewInventoryDetails(dto: CreateItemDTO, req: Request, tenantId: string) {
    let errors = validateSync(dto, { validationError: { target: false } });
    if (this.hasErrors(errors)) {
      return errors;
    }
    
    // await req.app.locals.inventoryItem.find({ nameHash: this.sha256(dto.name), tenantId }).then(result => {
    //   if (result && result[0] && result[0]._id && result[0]._id != req.params.id) {
    //     errors.push(this.getItemNameDuplicateError(dto.name));
    //   } else if (result && result[0] && result[0]._id && !req.params.id) {
    //     errors.push(this.getItemNameDuplicateError(dto.name));
    //   }
    // }).catch(e => {
    //   console.log('error', e);
    // });



    // await req.app.locals.inventoryCategory.find({ _id: dto.category })
    //   .then(category => {
    //     if (category.length == 0) {
    //       errors.push(this.getRequestUnprocessableCategoryError(dto.category));
    //     }
    //   }).catch(err => {
    //     errors.push(this.getRequestUnprocessableCategoryError(dto.category));
    //   });


    //   for(let property of dto.properties) {
        
        
    //     await req.app.locals.property.find({_id: property.id}).then(result => {
    //     if(result.length == 0) {
    //         errors.push(this.getRequestUnprocessablePropertyError(result));
    //       }
    //     }).catch(error => {
    //             errors.push(this.getRequestUnprocessablePropertyError(dto.properties))
    //       })
    //   }

    return errors;
  }


  async findInventoryWithSameNameForTenant(inventory, name: string, tenantId: string) {
    var found = 0;
    await inventory.countDocuments({ nameHash: this.sha256(name),tenantId: tenantId}).then(e => {
        found = e;
      });
    return found;
  }
}