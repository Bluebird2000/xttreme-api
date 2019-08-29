"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var basecontroller_1 = require("./basecontroller");
var AuthService_1 = require("../services/AuthService");
var XttremeInventoryController = /** @class */ (function (_super) {
    __extends(XttremeInventoryController, _super);
    function XttremeInventoryController() {
        return _super.call(this) || this;
    }
    XttremeInventoryController.prototype.loadRoutes = function (prefix, router) {
        this.registerUser(prefix, router);
        this.confirmUser(prefix, router);
        this.resendEmailConfirmationLink(prefix, router);
        this.resetPassword(prefix, router);
        this.loginUser(prefix, router);
    };
    XttremeInventoryController.prototype.registerUser = function (prefix, router) {
        router.post(prefix + "/auth/register", function (req, res, next) {
            new AuthService_1.AuthService().registerUser(req, res, next);
        });
    };
    XttremeInventoryController.prototype.confirmUser = function (prefix, router) {
        router.post(prefix + "/auth/confirmation", function (req, res, next) {
            new AuthService_1.AuthService().confirmUser(req, res, next);
        });
    };
    XttremeInventoryController.prototype.resendEmailConfirmationLink = function (prefix, router) {
        router.post(prefix + "/auth/resend", function (req, res, next) {
            new AuthService_1.AuthService().resendEmailConfirmationLink(req, res, next);
        });
    };
    XttremeInventoryController.prototype.resetPassword = function (prefix, router) {
        router.post(prefix + "/auth/reset_password", function (req, res, next) {
            new AuthService_1.AuthService().processResetPassword(req, res, next);
        });
    };
    XttremeInventoryController.prototype.loginUser = function (prefix, router) {
        router.post(prefix + "/auth/login", function (req, res, next) {
            new AuthService_1.AuthService().loginUser(req, res, next);
        });
    };
    XttremeInventoryController.prototype.authorize = function (req, res, next) {
        if (!this.authorized(req, res, next)) {
            this.sendError(req, res, next, this.notAuthorized);
        }
        else {
            next();
        }
    };
    return XttremeInventoryController;
}(basecontroller_1.BaseController));
exports.XttremeInventoryController = XttremeInventoryController;
