import { Injectable } from "@nestjs/common";
import { IUser } from "@purple/interfaces";
import { RMQService } from "nestjs-rmq";
import { UserEntity } from "./entities/user.entity";
import { UserRepository } from "./repositories/user.repository";
import { BuyCourseSaga } from "./sagas/buy-course.saga";
import { UserEventEmitter } from "./user.event-imitter";

@Injectable()
export class UserService {

    constructor(
        private readonly userRepository: UserRepository,
        public  readonly rmqServie: RMQService,
        private readonly userEventEmitter: UserEventEmitter
    ) { }

    async changeProfile(user: Pick<IUser, 'displayName'>, id: string) {
        const existedUser = await this.userRepository.findUserById(id);
        if (!existedUser) {
            throw new Error('Пользовутель не найдено')
        }
        const userEntity = new UserEntity(existedUser).updateProfile(user.displayName);
        await this.updateUser(userEntity);
        return {};
    }

    async buyCourse(userId: string, courseId: string) {
        const existUser = await this.userRepository.findUserById(userId);
        if (!existUser) {
            throw new Error("Такого пользовутеля нет")
        }
        const userEntity = new UserEntity(existUser);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqServie);
        const { user, paymentLink } = await saga.getState().pay();
        await this.updateUser(user);
        return { paymentLink }
    }


    async checkPayment( userId: string, courseId: string ) {
        const existUser = await this.userRepository.findUserById(userId);
        if (!existUser) {
            throw new Error("Такого пользовутеля нет")
        }
        const userEntity = new UserEntity(existUser);
        const saga = new BuyCourseSaga(userEntity, courseId, this.rmqServie);
        const { user, status } = await saga.getState().checkPayment();
        await this.updateUser(user);
        return status;
    };

    private updateUser(user: UserEntity) {
        return Promise.all([
            this.userEventEmitter.handle(user),
            this.userRepository.updateUser(user)
        ])
    }
}