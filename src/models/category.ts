import { Document } from "mongoose";
import { ICategory } from "../interfaces/category";

export interface IInventoryCategoryModel extends ICategory, Document {
  //custom methods for your model would be defined here
}
