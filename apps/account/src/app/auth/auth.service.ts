import { Injectable } from '@nestjs/common';
import { UserRepository } from '../user/repositories/user.repository';
import { UserEntity } from '../user/entities/user.entity';
import { UserRole } from '@purple/interfaces';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { AccountRegister } from '@purple/contracts';

@Injectable()
export class AuthService {
    constructor(
        private readonly userRepoistory: UserRepository,
        private readonly jwtService: JwtService
    ) { }

    async register({ email, password, displayName }: AccountRegister.Request) {
        const oldUser = await this.userRepoistory.findUser(email);
        if (oldUser) {
            throw new Error('Такой пользуватель уже зарегистирован')
        }
        const newUserEntity = new UserEntity({
            email,
            passwordHash: '', 
            displayName,
            role: UserRole.Student
        });
    
        await newUserEntity.setPassword(password);
        
        console.log("Saving user with _id:", newUserEntity);

        const newUser = await this.userRepoistory.createUser(newUserEntity);
        return { email: newUser.email };
    }

    async validateUser(email: string, password: string) {
        const user = await this.userRepoistory.findUser(email)

        if (!user) {
            throw new Error('Неверный логин или пароль')
        }
        const userEntity = new UserEntity(user);
        const isCorrectPassword = await userEntity.validatePassword(password);
        if (!isCorrectPassword) {
            throw new Error('Неверный логин или пароль')
        }

        return {
            id: user._id
        }
    }
    async login(id: Types.ObjectId | string) {
        return {
            acces_token: await this.jwtService.signAsync({ id })
        }
    }
}
