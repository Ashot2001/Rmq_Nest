import { PurchesState } from '@purple/interfaces';
import { IsString } from 'class-validator';

export namespace AccountChangeCourse {
    export const topic = 'account.change-course.event';

    export class Request {

        @IsString()
        userId: string;

        @IsString()
        courseId:string;
        
        @IsString()
        state:PurchesState;
    }

}
