"use strict";
exports.__esModule = true;
var jsonwebtoken_1 = require("jsonwebtoken");
var dotenv = require("dotenv");
dotenv.config();
/**
 * Constructor
 *
 * @class BaseController
 */
var BaseController = /** @class */ (function () {
    function BaseController() {
        this.systemErrorMsg = { "message": "Sorry your request could not be completed at the moment" };
        this.invalidCredentials = { 'message': 'Invalid Credentials' };
        this.notAuthorized = { 'message': 'You are not authorized to access this resource' };
        this.itemNotFound = { 'message': 'Not found' };
        this.noResults = { 'message': 'No results available' };
        this.start = 0;
        this.limit = 20;
        this.user_firstname = null;
        this.user_lastname = null;
        this.user_id = null;
        this.user_email = null;
    }
    BaseController.prototype.initPagination = function (req, post) {
        var obj = post ? req.body : req.query;
        if (obj.start && !isNaN(obj.start)) {
            this.start = +obj.start;
        }
        if (obj.limit && !isNaN(obj.limit)) {
            this.limit = +obj.limit;
        }
    };
    BaseController.prototype.sendResponse = function (serviceResponse, req, res, next) {
        var response = {
            status: serviceResponse.getStatusString(),
            data: serviceResponse.getData()
        };
        res.status(this.getHttpStatus(serviceResponse.getStatusString()));
        console.log('responding with', response);
        res.json(response);
        next();
    };
    BaseController.prototype.getHttpStatus = function (status) {
        switch (status) {
            case 'SUCCESS':
                return 200;
            case 'CREATED':
                return 201;
            case 'FAILED_VALIDATION':
                return 400;
            case 'UNATHORIZED':
                return 401;
            default:
                return 500;
        }
    };
    BaseController.prototype.sendError = function (req, res, next, data) {
        var dat = {
            status: 400,
            data: data
        };
        res.status(401);
        res.send(dat);
        return next();
    };
    BaseController.prototype.authorized = function (req, res, next) {
        var token = (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') ? req.headers.authorization.split(' ')[1] : null;
        if (token === null) {
            console.log('cant find header');
            return false;
        }
        try {
            var secret = process.env.USER_JWT_SECRET;
            var user = jsonwebtoken_1.verify(token, secret);
            this.setUserVariables(user);
            return true;
        }
        catch (err) {
            console.log(err);
            return false;
        }
    };
    BaseController.prototype.setUserVariables = function (user) {
        this.user_firstname = user.firstname;
        this.user_lastname = user.lastname;
        this.user_id = user.userId;
        this.user_email = user.email;
    };
    return BaseController;
}());
exports.BaseController = BaseController;
