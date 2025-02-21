import { Document, Types } from "mongoose";
import { IUser, IUserCourses, PurchesState, UserRole } from '@purple/interfaces'
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";


@Schema()
export class UserCourses extends Document implements IUserCourses {
    
    _id: string;

    @Prop({ required: true })
    courseId: string;

    @Prop({ required: true, enum: PurchesState, type: String })
    purchaseStateId: PurchesState;
}

export const UserCoursesSchema = SchemaFactory.createForClass(UserCourses)


@Schema()
export class User extends Document implements IUser {

    _id: string;

    @Prop()
    displayName?: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    passwordHash: string;

    @Prop({ required: true, enum: UserRole, type: String, default: UserRole.Student })
    role: UserRole;

    @Prop({ type: [UserCoursesSchema],  _id: false })
    courses: Types.Array<UserCourses>;
}

export const UserSchema = SchemaFactory.createForClass(User)