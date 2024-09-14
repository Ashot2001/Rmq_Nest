import {  IsString } from "class-validator";
import { IUserCourses} from '@purple/interfaces'

export namespace AccountUserCourses {
    export const topic = 'account.user-courses.query';

    export class Request {
        @ IsString()
        id: string;


        constructor(id: string,) {
            this.id = id;
        }
    }

    export class Response {
        courses: IUserCourses[];
        
        constructor(courses: IUserCourses[]){
            this.courses=courses;
        }
    }
}
