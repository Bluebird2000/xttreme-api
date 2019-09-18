import * as pug from 'pug';
import htmlToText from 'html-to-text';
import { BaseService } from "./BaseService";
import { BasicResponse } from "../dto/output/basicresponse";
import { Status } from '../dto/enums/statusenum';
import { NextFunction, Request, Response } from "express";
import { validateSync } from "class-validator";
import { handleException } from "../aspects/exception";
import { RegisterUserDTO } from "../dto/input/registeruserdto";
import { ConfirmUserDTO } from '../dto/input/confirmuserdto';
import { ResetPasswordDTO } from '../dto/input/resetpassworddto';
import { ForgotPasswordDTO } from '../dto/input/forgotpassworddto';
import { LoginUserDTO } from '../dto/input/loginuserdto';
import { IRegisterModel } from '../models/register';
import { roleList } from "../dto/enums/data";
import uuid = require('uuid');
import { compareSync, hashSync } from "bcrypt-nodejs";
import { ITokenModel } from '../models/token';
import SGmail = require('@sendgrid/mail');
const baseUrl = process.env.BASE_URL;

export class AuthService extends BaseService {

    public async listRoles(req: Request, res: Response, next: NextFunction) {
        this.sendResponse(new BasicResponse(Status.SUCCESS, roleList), res);
    }

    @handleException()
    public async registerUser(req: Request, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body;
        let dto = new RegisterUserDTO(firstName, lastName, email, password);
        let errors = await this.validateNewUserDetails(dto, req);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }
        await this.processNewUserRegistrationData(req, res, next, dto)
    }

    public async processNewUserRegistrationData(req: Request, res: Response, next: NextFunction, dto: RegisterUserDTO) {
        const encryptedPassword = hashSync(dto.password);
        let { firstName, lastName, email } = dto
        const secret = { firstName, lastName, email: email.toLowerCase(), password: encryptedPassword }
        const twoCharacterStr = await this.getTwoRandomAlphabeticStrAsManagementIdentifiers();
        const timestampInMilliSeconds = Date.now();
        const uniqueManagementref = `${twoCharacterStr}-${timestampInMilliSeconds}-${uuid()}`;
        let register: IRegisterModel = req.app.locals.register({ secret, emailHash: this.sha256(email), userId: uuid(), managementId: uniqueManagementref });
        let responseObj = null
        await register.save().then(async result => {
            if (result) {
                await this.saveNewUserData(req, res, next, dto, result)
            } else {
                responseObj = new BasicResponse(Status.FAILED_VALIDATION);
            }
        }).catch(err => {
            responseObj = new BasicResponse(Status.ERROR, err);
        });

        this.sendResponse(responseObj, res);
    }


    public async saveNewUserData(req, res, next, dto, result ) {
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
        SGmail.setApiKey(process.env.SEND_GRID_KEY);
        const msg = {
            to: email,
            from: 'email@xttreme.com',
            subject: 'Account Verification',
            html: `<p>Click on this link to activate and confirm your account <a href="${baseUrl}/${midpath}/${data}">${midpath} Link</p>`
        };
        SGmail.send(msg);
    }

    @handleException()
    public async confirmUser(req: Request, res: Response, next: NextFunction) {
        const { token } = req.body;
        let dto = new ConfirmUserDTO(token);
        let errors = await this.validateDetails(dto, req);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }
        await this.processUserVerificationRequest(req, res, next, dto)
    }

    public async processUserVerificationRequest(req, res, next, dto) {
        await req.app.locals.token.findOne({ token: dto.token }).then(async token => {
            if (!token) {
                return this.sendResponse(new BasicResponse(Status.PRECONDITION_FAILED, { msg: 'Account activation failed. Your verification link may have expired.' }), res);
            }
            await req.app.locals.register.findOne({ _id: token._userId }).then(async result => {
                if (!result) return this.sendResponse(new BasicResponse(Status.NOT_FOUND, { msg: 'No user found.' }), res);
                if (result.isVerified) return this.sendResponse(new BasicResponse(Status.UNPROCESSABLE_ENTRY, { msg: 'This user has already been verified.' }), res);
                result.isVerified = true
                await result.save().then(user => {
                    if (user) {
                        return this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: "Account has been verified. Please log in." }), res)
                    } else {
                        return this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION), res)
                    }
                }).catch(err => {
                    this.sendResponse(new BasicResponse(Status.ERROR), res)
                })
            })
        })
    }

    @handleException()
    public async resendEmailConfirmationLink(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        let dto = new ForgotPasswordDTO(email);
        let errors = await this.validateDetails(dto, req);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }
        await this.resendToken(req, res, next, dto)

    }

    public async resendToken(req, res, next, dto) {
        await req.app.locals.register.findOne({ emailHash: this.sha256(dto.email.toLowerCase()) }).then(async user => {
            if (!user) return this.sendResponse(new BasicResponse(Status.NOT_FOUND, { msg: 'We were unable to find a user with that email.' }), res);
            if (user.isVerified) return this.sendResponse(new BasicResponse(Status.PRECONDITION_FAILED, { msg: 'This account has already been verified. Please log in.' }), res);
            const tokenData = this.createToken(user);
            let token: ITokenModel = req.app.locals.token({ _userId: user._id, token: tokenData.token });
            await token.save().then(result => {
                if (!result) return this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, { msg: "Could not generate token" }), res);
                this.sendMail(req, res, next, dto.email, result.token, "confirmation")
                this.sendResponse(new BasicResponse(Status.SUCCESS, { token: tokenData.token, msg: `A verification email has been sent to ${ user.secret.email }`}), res);
                return next();

            })

        })
    }
    

    public async processResetPassword(req, res, next) {
        const { id, password } = req.body;
        let dto = new ResetPasswordDTO(id, password);
        let errors = await this.validateDetails(dto, req);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }

        await this.resetPassword(req, res, next, dto)
    }


    public async resetPassword(req, res, next, dto) {
        await req.app.locals.register.findOne({ _id: dto.id }).then(async user => {
            if (!user) return this.sendResponse(new BasicResponse(Status.NOT_FOUND, { msg: 'We were unable to find a user for this account.' }), res);
            user.password = hashSync(dto.password);

            await user.save().then(result => {
                if (!result) return this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, { msg: "Could not reset your password" }), res);
                this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: "You have successfully changed your password" }), res);
                return next();
            })

        })
    }

    @handleException()
    public async sendResetPasswordLink(req: Request, res: Response, next: NextFunction) {
        const { email } = req.body;
        let dto = new ForgotPasswordDTO(email);
        let errors = await this.validateDetails(dto, req);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }

        await req.app.locals.register.findOne({ email: dto.email.toLowerCase() }).then(async user => {
            if (!user) return this.sendResponse(new BasicResponse(Status.NOT_FOUND, { msg: 'We were unable to find a user with that email.' }), res);
            if (user && !user.isVerified) return this.sendResponse(new BasicResponse(Status.PRECONDITION_FAILED, { msg: 'Check your mail or resend activation link to activate your account.' }), res);
            this.sendMail(req, res, next, dto.email, user._id, "reset-password")
            this.sendResponse(new BasicResponse(Status.SUCCESS, { msg: "The reset password link has been sent to your email" }), res);

        })

    }


    @handleException()
    public async loginUser(req: Request, res: Response, next: NextFunction) {
        const { username, password } = req.body;
        let dto = new LoginUserDTO(username, password);
        let responseObj = null
        let errors = await this.validateDetails(dto, req);
        if (this.hasErrors(errors)) {
            this.sendResponse(new BasicResponse(Status.FAILED_VALIDATION, errors), res);
            return next();
        }
        await req.app.locals.register.findOne({ emailHash: this.sha256(dto.username.toLowerCase()) }).then(async result => {
            if (result) {
                await this.processUserLoginAction(res, next, dto, result);
            } else {
                responseObj = new BasicResponse(Status.FAILED_VALIDATION, { msg: 'email does not exist' });
            }
        }).catch(err => {
            responseObj = new BasicResponse(Status.ERROR, err);
        });
        this.sendResponse(responseObj, res);

    }


    public async processUserLoginAction(res, next, dto, result) {
        let responseObj = null;
        if (compareSync(dto.password, result.secret.password)) {
            if (!result.isVerified) {
                responseObj = new BasicResponse(Status.PRECONDITION_FAILED, { msg: 'Your account has not been verified.' });
            } else {
                const tokenData = this.createToken(result);
                responseObj = new BasicResponse(Status.SUCCESS, { result, tokenData });
            }
        } else {
            responseObj = new BasicResponse(Status.FAILED_VALIDATION, { msg: 'email or password is incorrect' });
        }

        this.sendResponse(responseObj, res);

    }
    

    getTwoRandomAlphabeticStrAsManagementIdentifiers(){
        let randomString = '';
        let randomAscii;
        for(let i = 0; i < 2; i++) {
            randomAscii = Math.floor((Math.random() * 25) + 65);
            randomString += String.fromCharCode(randomAscii);
        }
        return randomString;
    }


    async validateNewUserDetails(dto: RegisterUserDTO, req: Request) {
        let errors = validateSync(dto, { validationError: { target: false } });
        if (this.hasErrors(errors)) {
            return errors;
        }
        // await req.app.locals.register.find({ emailHash: this.sha256(dto.email.toLowerCase()) }).then(result => {
        //     if (result && result[0] && result[0]._id && result[0]._id != req.params.id) {
        //         errors.push(this.getDuplicateEmailError(dto.email.toLowerCase()));
        //     } else if (result && result[0] && result[0]._id && !req.params.id) {
        //         errors.push(this.getDuplicateEmailError(dto.email.toLowerCase()));
        //     }
        // });j

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
