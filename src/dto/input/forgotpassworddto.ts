import {IsEmail, IsNotEmpty, IsUrl} from "class-validator";

export class ForgotPasswordDTO {
 

    @IsEmail()
    @IsNotEmpty({
        message: 'email is required'
    })
    email: string;


    constructor(email?: string, baseUrl?: string){
        this.email = email;
    }
}