"use strict";
exports.__esModule = true;
var Validator_1 = require("validator.ts/Validator");
var chalk = require("chalk");
var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
var BaseService = /** @class */ (function () {
    function BaseService() {
    }
    BaseService.prototype.hasErrors = function (input) {
        var errors = new Validator_1.Validator().validate(input);
        this.errors = errors;
        return !(errors === undefined || errors.length == 0);
    };
    BaseService.prototype.sha256 = function (data) {
        return crypto.createHash("sha256").update(data, "utf8").digest("base64");
    };
    BaseService.prototype.sendError = function (req, res, next, data) {
        var dat = {
            status: 401,
            data: data
        };
        res.status(401);
        res.send(dat);
    };
    BaseService.prototype.sendResponse = function (serviceResponse, res) {
        var response = {
            status: serviceResponse.getStatusString(),
            data: serviceResponse.getData(),
            count: serviceResponse.getCount(),
            averageEnergyConsumption: serviceResponse.getaverageEnergyConsumption()
        };
        res.status(this.getHttpStatus(serviceResponse.getStatusString()));
        console.log('responding with', response);
        res.json(response);
    };
    BaseService.prototype.sendException = function (ex, serviceResponse, req, res, next) {
        console.log(chalk["default"].blue.bgRed.bold(ex));
        this.sendResponse(serviceResponse, res);
    };
    BaseService.prototype.getHttpStatus = function (status) {
        switch (status) {
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'SUCCESS_NO_CONTENT':
                return 204;
            case 'FAILED_VALIDATION':
                return 400;
            case 'NOT_FOUND':
                return 404;
            case 'CONFLICT':
                return 409;
            case 'UNPROCESSABLE_ENTRY':
                return 422;
            case 'UNATHORIZED':
                return 401;
            case 'PRECONDITION_FAILED':
                return 412;
            default:
                return 500;
        }
    };
    BaseService.prototype.logInfo = function (info) {
        console.log(chalk["default"].blue.bgGreen.bold(info));
    };
    BaseService.prototype.logError = function (error) {
        console.log(chalk["default"].blue.bgRed.bold(error));
    };
    BaseService.prototype.getDuplicateError = function (name) {
        return { 'property': 'name', 'constraints': { 'unique': 'must be unique' }, value: name };
    };
    BaseService.prototype.getDuplicateEmailError = function (email) {
        return { 'property': 'email', 'constraints': { 'unique': 'email must be unique' }, value: email };
    };
    BaseService.prototype.getUserTokenError = function (userToken) {
        return { 'property': 'userToken', 'constraints': { 'invalid': 'userToken must be a valid token' }, value: userToken };
    };
    BaseService.prototype.createToken = function (user) {
        var expiresIn = process.env.USER_TOKEN_EXPIRY;
        var secret = process.env.USER_JWT_SECRET;
        var dataStoredInToken = {
            _id: user._id,
            email: user.email
        };
        var secure = true;
        var token = jwt.sign(dataStoredInToken, secret, { expiresIn: expiresIn });
        return {
            expiresIn: expiresIn,
            token: token,
            secure: secure
        };
    };
    BaseService.prototype.createCookie = function (tokenData) {
        return "Photizzo=" + tokenData.token + "; Max-Age=" + tokenData.expiresIn;
    };
    return BaseService;
}());
exports.BaseService = BaseService;
