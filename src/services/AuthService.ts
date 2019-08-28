import { BaseService } from "./BaseService";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from '../dto/enums/statusenum';
import { NextFunction, Request, Response } from "express";
import { validateSync } from "class-validator";
import { handleException } from "../aspects/exception";
import { RegisterUserDTO } from "../dto/input/registeruserdto";
import { IRegisterModel } from '../models/register';
import uuid = require('uuid');
import { compareSync, hashSync } from "bcrypt-nodejs";
import { ITokenModel } from '../models/token';
import SGmail = require('@sendgrid/mail');
const baseUrl = process.env.BASE_URL;

export class AuthService extends BaseService {

    @handleException()
    public async registerUser(req: Request, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password, wattbankSN } = req.body;
        let dto = new RegisterUserDTO(firstName, lastName, email, password, wattbankSN);
        let errors = await this.validateNewUserDetails(dto, req);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }
        await this.saveNewUserData(req, res, next, dto)
    }

    public async saveNewUserData(req: Request, res: Response, next: NextFunction, dto: RegisterUserDTO) {

        const encryptedPassword = hashSync(dto.password);
        let { firstName, lastName, email, wattbankSN } = dto
        const secret = { firstName, lastName, email: email.toLowerCase(), password: encryptedPassword, wattbankSN, uuid: uuid() }
        let register: IRegisterModel = req.app.locals.register({ secret, emailHash: this.sha256(email) });
        let responseObj = null
        await register.save().then(async result => {
            if (result) {
                await this.processRequestAfterSuccessfulValidation(req, res, next, dto, result)
            } else {
                responseObj = new BasicResponse(Status.FAILED_VALIDATION);
            }
        }).catch(err => {
            responseObj = new BasicResponse(Status.ERROR, err);
        });

        this.sendResponse(responseObj, res);
    }


    public async processRequestAfterSuccessfulValidation(req, res, next, dto, result ) {
        let responseObj = null
        const tokenData = this.createToken(result);
        let token: ITokenModel = req.app.locals.token({ _userId: result._id, token: tokenData.token });
        await token.save().then(output => {
            if (output) {
                this.sendMail(req, res, next, dto.email, output.token, "confirmation");
                responseObj = new BasicResponse(Status.CREATED, { token: tokenData.token, id: result._id, msg: `A verification email has been sent to ${ result.secret.email }` });
                return next();
            } else {
                responseObj = new BasicResponse(Status.UNPROCESSABLE_ENTRY, { msg: "Could not generate token" })
            }
        });
        this.sendResponse(responseObj, res);
    }

    public async sendMail(req: Request, res: Response, next: NextFunction, email, data, midpath) {
        SGmail.setApiKey(process.env.SEND_GRID_KEY)
        const msg = {
            to: email,
            from: 'email@photizzo.com',
            subject: 'Account Verification',
            html: `<p>Click on this link to activate and confirm your account <a href="${baseUrl}/${midpath}/${data}">${midpath} Link</p>`
        };
        SGmail.send(msg);
    }


    async validateNewUserDetails(dto: RegisterUserDTO, req: Request) {
        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
        await req.app.locals.register.find({ emailHash: this.sha256(dto.email.toLowerCase()) }).then(result => {
            if (result && result[0] && result[0]._id && result[0]._id != req.params.id) {
                errors.push(this.getDuplicateEmailError(dto.email.toLowerCase()));
            } else if (result && result[0] && result[0]._id && !req.params.id) {
                errors.push(this.getDuplicateEmailError(dto.email.toLowerCase()));
            }
        });

        return errors;
    }


    hasErrors(errors) {
        return !(errors === undefined || errors.length == 0);
    }


    async validateDetails(dto, req: Request) {

        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
        return errors
    }
}
