import { BaseService } from "./BaseService";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from "../dto/enums/statusenum";
import { NextFunction, Request, Response } from "express";
import { IItemModel } from "../models/item";
import { CreatItemDTO } from "../dto/input/createitemdto";
import { validateSync } from "class-validator";
import { verify } from 'jsonwebtoken';
import { trailNewRecord, handleException, singleList, trailUpdatedRecord, list} from "../aspects/historytrail";


export class InventoryService extends BaseService {
  
@handleException()
  public async addNewItem( req: Request, res: Response, next: NextFunction, userId: string, managementId: string) {
    const { name, description, quantity, category, properties, image, tag, purchased_total_amount_per_item, unit_cost, transaction_reference } = req.body;
    let dto = new CreatItemDTO(name, description, quantity, category, properties, image, tag, purchased_total_amount_per_item, unit_cost, transaction_reference);

    let errors = await this.validateNewInventoryDetails(dto, req, managementId);
    if (this.hasErrors(errors)) {
      this.sendResponse(
        new BasicResponse(Status.FAILED_VALIDATION, errors), res);
      return next();
    }

    await this.saveNewItemData(req, res, next, userId, managementId, dto);
  }


  @trailNewRecord("item")
  async saveNewItemData(req: Request,res: Response, next: NextFunction, userId: string, managementId: string, dto: CreatItemDTO
  ) {
    let { name, description, quantity, category, properties, image, tag, purchased_total_amount_per_item, unit_cost, transaction_reference } = dto;
    const secret = { name, description, quantity, category, properties, image, tag, purchased_total_amount_per_item, unit_cost, transaction_reference }
    
    let item: IItemModel = req.app.locals.item({ secret, userId, managementId});

    return item;
  
   
  }

  async validateNewInventoryDetails(dto: CreatItemDTO, req: Request, tenantId: string) {
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

    // if (dto.image) {
    //   let validateToken = await this.validateImageUploadToken(dto, req, tenantId);
    //   if (!validateToken) {
    //     errors.push(this.validateImageToken(dto.image));
    //   }
    // }


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