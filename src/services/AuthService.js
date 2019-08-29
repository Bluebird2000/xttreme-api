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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.__esModule = true;
var BaseService_1 = require("./BaseService");
var basicresponse_1 = require("../dto/output/basicresponse");
var statusenum_1 = require("../dto/enums/statusenum");
var class_validator_1 = require("class-validator");
var exception_1 = require("../aspects/exception");
var registeruserdto_1 = require("../dto/input/registeruserdto");
var confirmuserdto_1 = require("../dto/input/confirmuserdto");
var resetpassworddto_1 = require("../dto/input/resetpassworddto");
var forgotpassworddto_1 = require("../dto/input/forgotpassworddto");
var loginuserdto_1 = require("../dto/input/loginuserdto");
var uuid = require("uuid");
var bcrypt_nodejs_1 = require("bcrypt-nodejs");
var SGmail = require("@sendgrid/mail");
var baseUrl = process.env.BASE_URL;
var AuthService = /** @class */ (function (_super) {
    __extends(AuthService, _super);
    function AuthService() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AuthService.prototype.registerUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, firstName, lastName, email, password, dto, errors;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, firstName = _a.firstName, lastName = _a.lastName, email = _a.email, password = _a.password;
                        dto = new registeruserdto_1.RegisterUserDTO(firstName, lastName, email, password);
                        return [4 /*yield*/, this.validateNewUserDetails(dto, req)];
                    case 1:
                        errors = _b.sent();
                        if (this.hasErrors(errors)) {
                            this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, errors), res);
                            return [2 /*return*/, next()];
                        }
                        return [4 /*yield*/, this.saveNewUserData(req, res, next, dto)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.saveNewUserData = function (req, res, next, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var encryptedPassword, firstName, lastName, email, secret, register, responseObj;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        encryptedPassword = bcrypt_nodejs_1.hashSync(dto.password);
                        firstName = dto.firstName, lastName = dto.lastName, email = dto.email;
                        secret = { firstName: firstName, lastName: lastName, email: email.toLowerCase(), password: encryptedPassword, uuid: uuid() };
                        register = req.app.locals.register({ secret: secret, emailHash: this.sha256(email) });
                        responseObj = null;
                        return [4 /*yield*/, register.save().then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!result) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.processRequestAfterSuccessfulValidation(req, res, next, dto, result)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION);
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })["catch"](function (err) {
                                responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.ERROR, err);
                            })];
                    case 1:
                        _a.sent();
                        this.sendResponse(responseObj, res);
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.processRequestAfterSuccessfulValidation = function (req, res, next, dto, result) {
        return __awaiter(this, void 0, void 0, function () {
            var responseObj, tokenData, token;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        responseObj = null;
                        tokenData = this.createToken(result);
                        token = req.app.locals.token({ _userId: result._id, token: tokenData.token });
                        return [4 /*yield*/, token.save().then(function (output) {
                                if (output) {
                                    _this.sendMail(req, res, next, dto.email, output.token, "confirmation");
                                    responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.CREATED, { token: tokenData.token, id: result._id, msg: "A verification email has been sent to " + result.secret.email });
                                    return next();
                                }
                                else {
                                    responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.UNPROCESSABLE_ENTRY, { msg: "Could not generate token" });
                                }
                            })];
                    case 1:
                        _a.sent();
                        this.sendResponse(responseObj, res);
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.sendMail = function (req, res, next, email, data, midpath) {
        return __awaiter(this, void 0, void 0, function () {
            var msg;
            return __generator(this, function (_a) {
                SGmail.setApiKey(process.env.SEND_GRID_KEY);
                msg = {
                    to: email,
                    from: 'email@photizzo.com',
                    subject: 'Account Verification',
                    html: "<p>Click on this link to activate and confirm your account <a href=\"" + baseUrl + "/" + midpath + "/" + data + "\">" + midpath + " Link</p>"
                };
                SGmail.send(msg);
                return [2 /*return*/];
            });
        });
    };
    AuthService.prototype.confirmUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var token, dto, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        token = req.body.token;
                        dto = new confirmuserdto_1.ConfirmUserDTO(token);
                        return [4 /*yield*/, this.validateDetails(dto, req)];
                    case 1:
                        errors = _a.sent();
                        if (this.hasErrors(errors)) {
                            this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, errors), res);
                            return [2 /*return*/, next()];
                        }
                        return [4 /*yield*/, this.verifyAndSaveUser(req, res, next, dto)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.verifyAndSaveUser = function (req, res, next, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.app.locals.token.findOne({ token: dto.token }).then(function (token) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!token) {
                                            return [2 /*return*/, this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.PRECONDITION_FAILED, { msg: 'Account activation failed. Your verification link may have expired.' }), res)];
                                        }
                                        return [4 /*yield*/, req.app.locals.register.findOne({ _id: token._userId }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                                var _this = this;
                                                return __generator(this, function (_a) {
                                                    switch (_a.label) {
                                                        case 0:
                                                            if (!result)
                                                                return [2 /*return*/, this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.NOT_FOUND, { msg: 'No user found.' }), res)];
                                                            if (result.isVerified)
                                                                return [2 /*return*/, this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.UNPROCESSABLE_ENTRY, { msg: 'This user has already been verified.' }), res)];
                                                            result.isVerified = true;
                                                            return [4 /*yield*/, result.save().then(function (user) {
                                                                    if (user) {
                                                                        return _this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.SUCCESS, { msg: "Account has been verified. Please log in." }), res);
                                                                    }
                                                                    else {
                                                                        return _this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION), res);
                                                                    }
                                                                })["catch"](function (err) {
                                                                    _this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.ERROR), res);
                                                                })];
                                                        case 1:
                                                            _a.sent();
                                                            return [2 /*return*/];
                                                    }
                                                });
                                            }); })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resendEmailConfirmationLink = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var email, dto, errors;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        email = req.body.email;
                        dto = new forgotpassworddto_1.ForgotPasswordDTO(email);
                        return [4 /*yield*/, this.validateDetails(dto, req)];
                    case 1:
                        errors = _a.sent();
                        if (this.hasErrors(errors)) {
                            this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, errors), res);
                            return [2 /*return*/, next()];
                        }
                        return [4 /*yield*/, this.resendToken(req, res, next, dto)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resendToken = function (req, res, next, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.app.locals.register.findOne({ emailHash: this.sha256(dto.email.toLowerCase()) }).then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var tokenData, token;
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!user)
                                            return [2 /*return*/, this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.NOT_FOUND, { msg: 'We were unable to find a user with that email.' }), res)];
                                        if (user.isVerified)
                                            return [2 /*return*/, this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.PRECONDITION_FAILED, { msg: 'This account has already been verified. Please log in.' }), res)];
                                        tokenData = this.createToken(user);
                                        token = req.app.locals.token({ _userId: user._id, token: tokenData.token });
                                        return [4 /*yield*/, token.save().then(function (result) {
                                                if (!result)
                                                    return _this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, { msg: "Could not generate token" }), res);
                                                _this.sendMail(req, res, next, dto.email, result.token, "confirmation");
                                                _this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.SUCCESS, { token: tokenData.token, msg: "A verification email has been sent to " + user.secret.email }), res);
                                                return next();
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.processResetPassword = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, id, password, dto, errors;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, id = _a.id, password = _a.password;
                        dto = new resetpassworddto_1.ResetPasswordDTO(id, password);
                        return [4 /*yield*/, this.validateDetails(dto, req)];
                    case 1:
                        errors = _b.sent();
                        if (this.hasErrors(errors)) {
                            this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, errors), res);
                            return [2 /*return*/, next()];
                        }
                        return [4 /*yield*/, this.resetPassword(req, res, next, dto)];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.resetPassword = function (req, res, next, dto) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, req.app.locals.register.findOne({ _id: dto.id }).then(function (user) { return __awaiter(_this, void 0, void 0, function () {
                            var _this = this;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!user)
                                            return [2 /*return*/, this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.NOT_FOUND, { msg: 'We were unable to find a user for this account.' }), res)];
                                        user.password = bcrypt_nodejs_1.hashSync(dto.password);
                                        return [4 /*yield*/, user.save().then(function (result) {
                                                if (!result)
                                                    return _this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, { msg: "Could not reset your password" }), res);
                                                _this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.SUCCESS, { msg: "You have successfully changed your password" }), res);
                                                return next();
                                            })];
                                    case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                }
                            });
                        }); })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.loginUser = function (req, res, next) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, username, password, dto, responseObj, errors;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = req.body, username = _a.username, password = _a.password;
                        dto = new loginuserdto_1.LoginUserDTO(username, password);
                        responseObj = null;
                        return [4 /*yield*/, this.validateDetails(dto, req)];
                    case 1:
                        errors = _b.sent();
                        if (this.hasErrors(errors)) {
                            this.sendResponse(new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, errors), res);
                            return [2 /*return*/, next()];
                        }
                        return [4 /*yield*/, req.app.locals.register.findOne({ emailHash: this.sha256(dto.username.toLowerCase()) }).then(function (result) { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0:
                                            if (!result) return [3 /*break*/, 2];
                                            return [4 /*yield*/, this.processUserLoginAction(res, next, dto, result)];
                                        case 1:
                                            _a.sent();
                                            return [3 /*break*/, 3];
                                        case 2:
                                            responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, { msg: 'email does not exist' });
                                            _a.label = 3;
                                        case 3: return [2 /*return*/];
                                    }
                                });
                            }); })["catch"](function (err) {
                                responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.ERROR, err);
                            })];
                    case 2:
                        _b.sent();
                        this.sendResponse(responseObj, res);
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthService.prototype.processUserLoginAction = function (res, next, dto, result) {
        return __awaiter(this, void 0, void 0, function () {
            var responseObj, tokenData;
            return __generator(this, function (_a) {
                responseObj = null;
                if (bcrypt_nodejs_1.compareSync(dto.password, result.secret.password)) {
                    if (!result.isVerified) {
                        responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.PRECONDITION_FAILED, { msg: 'Your account has not been verified.' });
                    }
                    else {
                        tokenData = this.createToken(result);
                        responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.SUCCESS, { result: result, tokenData: tokenData });
                    }
                }
                else {
                    responseObj = new basicresponse_1.BasicResponse(statusenum_1.Status.FAILED_VALIDATION, { msg: 'email or password is incorrect' });
                }
                this.sendResponse(responseObj, res);
                return [2 /*return*/];
            });
        });
    };
    AuthService.prototype.validateNewUserDetails = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var errors;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        errors = class_validator_1.validateSync(dto, { validationError: { target: false } });
                        if (this.hasErrors(errors)) {
                            return [2 /*return*/, errors];
                        }
                        return [4 /*yield*/, req.app.locals.register.find({ emailHash: this.sha256(dto.email.toLowerCase()) }).then(function (result) {
                                if (result && result[0] && result[0]._id && result[0]._id != req.params.id) {
                                    errors.push(_this.getDuplicateEmailError(dto.email.toLowerCase()));
                                }
                                else if (result && result[0] && result[0]._id && !req.params.id) {
                                    errors.push(_this.getDuplicateEmailError(dto.email.toLowerCase()));
                                }
                            })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, errors];
                }
            });
        });
    };
    AuthService.prototype.hasErrors = function (errors) {
        return !(errors === undefined || errors.length == 0);
    };
    AuthService.prototype.validateDetails = function (dto, req) {
        return __awaiter(this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                errors = class_validator_1.validateSync(dto, { validationError: { target: false } });
                if (this.hasErrors(errors)) {
                    return [2 /*return*/, errors];
                }
                return [2 /*return*/, errors];
            });
        });
    };
    __decorate([
        exception_1.handleException()
    ], AuthService.prototype, "registerUser");
    __decorate([
        exception_1.handleException()
    ], AuthService.prototype, "confirmUser");
    __decorate([
        exception_1.handleException()
    ], AuthService.prototype, "resendEmailConfirmationLink");
    __decorate([
        exception_1.handleException()
    ], AuthService.prototype, "loginUser");
    return AuthService;
}(BaseService_1.BaseService));
exports.AuthService = AuthService;
