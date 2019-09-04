import { Schema, model } from "mongoose";
import * as mongoose from 'mongoose';
export let categorySchema: Schema = new Schema({
  secret: {
    name: String,
    description: String,
  },
  nameHash: {
    type: String,
    required: true
  },
  managementId: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  active: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastUpdatedAt: {
    type: Date
  }
});



  