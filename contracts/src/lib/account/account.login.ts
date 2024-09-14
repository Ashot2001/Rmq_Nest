import {  IsEmail, IsString } from "class-validator";

export namespace AccountLogin {
    export const topic = 'account.login.command';

    export class Request {
        @ IsEmail()
        email: string;

        @IsString()
        password: string;

        constructor(email: string, password: string) {
            this.email = email;
            this.password = password;
        }
    }

    export class Response {
        acces_token: string;
        constructor(acces_token: string) {
            this.acces_token = acces_token;
        }
    }
}
