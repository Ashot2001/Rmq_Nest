
import { Body, Controller } from '@nestjs/common';
import { RMQRoute, RMQValidate } from 'nestjs-rmq';
import { AccountBuyCourse, AccountChangeProfile, AccountCheckPayment } from '@purple/contracts';
import { UserService } from './user.service';


@Controller()
export class UserCommands {
    constructor(private readonly userService: UserService) { }

    @RMQValidate()
    @RMQRoute(AccountChangeProfile.topic)
    async changeProfile(@Body() { user, id }: AccountChangeProfile.Request) {
        return this.userService.changeProfile(user, id)
    }

    @RMQValidate()
    @RMQRoute(AccountBuyCourse.topic)
    async buyCourse(@Body() { userId, courseId }: AccountBuyCourse.Request) {
        return this.userService.buyCourse(userId, courseId)
    }

    @RMQValidate()
    @RMQRoute(AccountBuyCourse.topic)
    async checkPayment(@Body() { userId, courseId }: AccountCheckPayment.Request) {
        return this.userService.checkPayment(userId, courseId)
    }

}

