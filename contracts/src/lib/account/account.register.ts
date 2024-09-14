import {  IsEmail, IsOptional, IsString} from 'class-validator'

export namespace AccountRegister {
    export const topic = 'account.register.command';

    export class Request {
        @IsEmail()
        email: string;

        @IsString()
        password: string;

        @IsOptional()
        @IsString()
        displayName?: string;
 
        constructor(email: string, password: string, displayName?: string) {
            this.email = email;
            this.password = password;
            this.displayName= displayName;
        }
    }

    export class Response {
        email: string;
        constructor(email: string) {
            this.email = email;
        }
    }
}
