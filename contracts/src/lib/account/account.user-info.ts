import {  IsString } from "class-validator";
import {IUser} from '@purple/interfaces'

export namespace AccountUserInfo {
    export const topic = 'account.user-info.query';

    export class Request {
        @ IsString()
        id: string;


        constructor(id: string,) {
            this.id = id;
        }
    }

    export class Response {
        profile: Omit<IUser, 'passwordHash'>;

        constructor(profile: Omit<IUser, 'passwordHash'>) {
            this.profile = profile;
        }
    }
}
