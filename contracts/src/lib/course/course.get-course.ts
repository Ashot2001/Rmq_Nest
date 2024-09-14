import { ICourse } from "@purple/interfaces";
import { IsString } from "class-validator";

export namespace CourseContract {
    export const topic = 'course.get-info.query';

    export class Request{
        @IsString()
        id: string
    }

    export class Response {
        course: ICourse | null;
    }
}