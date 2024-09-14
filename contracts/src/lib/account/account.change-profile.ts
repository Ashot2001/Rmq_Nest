import { IUser } from '@purple/interfaces';
import { IsString } from 'class-validator';

export namespace AccountChangeProfile {
    export const topic = 'account.change-profile.command';

    export class Request {

        @IsString()
        id: string;

        @IsString()
        user: Pick<IUser, 'displayName'>;

        constructor(user: Pick<IUser, 'displayName'>, id: string) {
            this.id = id
            this.user = user;
        }
    }

    export class Response { }
}
