import {  Injectable } from "@nestjs/common";
import { User } from "../models/user.model";
import { Model } from "mongoose";
import { UserEntity } from "../entities/user.entity";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserRepository {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>)
         {
        console.log('Injecting model with name:', User.name);
    }

    async createUser(user: UserEntity) {
        const newUser = new this.userModel(user);        
        return newUser.save()
    }

    async findUser(email: string) {
        return this.userModel.findOne({email}).exec();
    }

    async findUserById(id: string) {
        return this.userModel.findById(id).exec();
    }

    async deleteUser(email: string) {
        return this.userModel.deleteOne({email}).exec();
    }

    async updateUser({_id, ...rest}: UserEntity) {
        return this.userModel.updateOne({_id}, {$set : {...rest}}).exec()
    }

}