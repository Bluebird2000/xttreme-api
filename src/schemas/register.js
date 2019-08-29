"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
exports.registerSchema = new mongoose_1.Schema({
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
        uuid: {
            type: String,
            required: true
        }
    },
    emailHash: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean, "default": false
    },
    createdAt: {
        type: Date,
        "default": Date.now
    },
    updatedBy: {
        type: String
    },
    lastUpdatedAt: {
        type: Date
    }
});
