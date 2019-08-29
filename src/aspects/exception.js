"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var kaop_ts_1 = require("kaop-ts");
var basicresponse_1 = require("../dto/output/basicresponse");
var statusenum_1 = require("../dto/enums/statusenum");
var class_validator_1 = require("class-validator");
var util_1 = require("util");
exports.handleException = function () { return kaop_ts_1.onException(function (meta) {
    var response = meta.args[1];
    sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.ERROR), response);
}); };
function isMissing(param) {
    return !param;
}
function isNotANumber(param) {
    return !(class_validator_1.IsNumberString(param) || util_1.isNumber(param));
}
exports.simpleList = function (schemaName) { return kaop_ts_1.afterMethod(function (meta) { return __awaiter(_this, void 0, void 0, function () {
    var request, response, next, tenantId, offset, limit, skip, count;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                request = meta.args[0];
                response = meta.args[1];
                next = meta.args[2];
                tenantId = request.app.locals.userobj.organisationId;
                offset = request.query.offset;
                limit = request.query.limit;
                if (isMissing(offset) || isNotANumber(offset)) {
                    offset = 0;
                }
                if (isMissing(limit) || isNotANumber(limit)) {
                    limit = 50;
                }
                skip = offset * limit;
                count = 0;
                return [4 /*yield*/, request.app.locals[schemaName].count({ tenantId: tenantId }).then(function (result) {
                        count = result;
                    })];
            case 1:
                _a.sent();
                request.app.locals[schemaName].find({ tenantId: tenantId }).skip(skip).limit(parseInt(limit)).then(function (result) {
                    if (!result) {
                        sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.ERROR), response);
                        return next();
                    }
                    else {
                        sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.SUCCESS, result, count), response);
                        return next();
                    }
                })["catch"](function (err) {
                    sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.ERROR, err), response);
                    return next();
                });
                return [2 /*return*/];
        }
    });
}); }); };
function sendResponse(serviceResponse, responseObj) {
    var clientResponse = {
        status: serviceResponse.getStatusString(),
        data: serviceResponse.getData()
    };
    responseObj.status(getHttpStatus(serviceResponse.getStatusString()));
    console.log('responding with', clientResponse);
    responseObj.json(clientResponse);
}
function getHttpStatus(status) {
    switch (status) {
        case 'SUCCESS':
            return 200;
        case 'CREATED':
            return 201;
        case 'FAILED_VALIDATION':
            return 400;
        default:
            return 500;
    }
}
