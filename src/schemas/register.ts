
import { Schema, model } from "mongoose";

export let registerSchema: Schema = new Schema({
  secret: {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
  },
  emailHash: {
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
  isVerified: {
    type: Boolean, default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: String,
  },
  lastUpdatedAt: {
    type: Date
  }

});
