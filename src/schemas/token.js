"use strict";
exports.__esModule = true;
var mongoose_1 = require("mongoose");
exports.tokenSchema = new mongoose_1.Schema({
    _userId: { type: mongoose_1.Schema.Types.ObjectId, required: true, ref: 'Register' },
    token: { type: String, required: true },
    createdAt: { type: Date, required: true, "default": Date.now, expires: 43200 }
});
