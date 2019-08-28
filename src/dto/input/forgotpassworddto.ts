import {IsEmail, IsNotEmpty, MinLength, MaxLength, IsUrl} from "class-validator";

export class ForgotPasswordDTO {
 

    @IsEmail()
    @IsNotEmpty({
        message: 'email is required'
    })
    email: string;

    constructor(email?: string){
        this.email = email;
    }
}