"use strict";
exports.__esModule = true;
var statusenum_1 = require("../enums/statusenum");
var BasicResponse = /** @class */ (function () {
    function BasicResponse(status, data, count, averageEnergyConsumption) {
        this.status = status;
        this.data = data;
        this.count = count;
        this.averageEnergyConsumption = averageEnergyConsumption;
    }
    BasicResponse.prototype.getData = function () {
        return this.data;
    };
    BasicResponse.prototype.getaverageEnergyConsumption = function () {
        return this.averageEnergyConsumption;
    };
    BasicResponse.prototype.getStatusString = function () {
        return statusenum_1.Status[this.status];
    };
    BasicResponse.prototype.getCount = function () {
        return this.count;
    };
    return BasicResponse;
}());
exports.BasicResponse = BasicResponse;
