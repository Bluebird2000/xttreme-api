"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var class_validator_1 = require("class-validator");
var LoginUserDTO = /** @class */ (function () {
    function LoginUserDTO(username, password) {
        this.username = username;
        this.password = password;
    }
    __decorate([
        class_validator_1.IsEmail(),
        class_validator_1.IsNotEmpty({
            message: 'userName is required'
        })
    ], LoginUserDTO.prototype, "username");
    __decorate([
        class_validator_1.IsNotEmpty({
            message: 'password is required'
        })
    ], LoginUserDTO.prototype, "password");
    return LoginUserDTO;
}());
exports.LoginUserDTO = LoginUserDTO;
