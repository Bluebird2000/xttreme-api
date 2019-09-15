import { Schema, model } from "mongoose";
import * as mongoose from 'mongoose';
export let itemSchema: Schema = new Schema({
    secret: {
        name: String,
        description: String,
        quantity: Number,
        reorder_level: Number,
    },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    tag: String,
    approval_status: {
        type: String,
        default: 'pending'
    },
    isActive: {
        type: Boolean,
        default: true
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
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date
    }
});
