import { CourseContract, PaymentCheck, PaymentGenerateLink, PaymentStatus } from "@purple/contracts";
import { BuyCourseSagaState } from "./buy-course.state";
import { PurchesState } from "@purple/interfaces";
import { UserEntity } from "../entities/user.entity";

export class BuyCourseSagStateStarted extends BuyCourseSagaState {

    public async pay(): Promise<{ paymentLink: string, user: UserEntity }> {
        const { course } = await this.saga.rmqService.send<CourseContract.Request, CourseContract.Response>(CourseContract.topic, {
            id: this.saga.courseId
        });

        if (!course) {
            throw new Error('Такого курса нету')
        }

        if (course.price === 0) {
            this.saga.setState(PurchesState.Purchased, course._id);
            return { paymentLink: null, user: this.saga.user };
        }
        const { link } = await this.saga.rmqService.send<PaymentGenerateLink.Request, PaymentGenerateLink.Response>(PaymentGenerateLink.topic, {
            courseId: course._id,
            userId: this.saga.user._id,
            sum: course.price
        });
        this.saga.setState(PurchesState.WaitingForPayment, course._id);
        return { paymentLink: link, user: this.saga.user };

    }

    public checkPayment(): Promise<{ user: UserEntity, status: PaymentStatus }> {
        throw new Error("Нельзя проверить платеж который не начался ")
    }

    public async cancel(): Promise<{ user: UserEntity }> {
        this.saga.setState(PurchesState.Canceled, this.saga.courseId)
        return {
            user: this.saga.user
        }
    }
}


export class BuyCourseSagStateProcess extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        throw new Error("Нельзя создать ссылку на оплату в процессе");
    }
    public async checkPayment(): Promise<{ user: UserEntity; status: PaymentStatus }> {
        const { status } = await this.saga.rmqService.send<PaymentCheck.Request, PaymentCheck.Response>(PaymentCheck.topic, {
            courseId: this.saga.courseId,
            userId: this.saga.user._id
        });

        if (status === "canceled") {
            this.saga.setState(PurchesState.Canceled, this.saga.courseId);
            return { user: this.saga.user, status: 'canceled' }
        };

        if (status !== "success") {
            return {user: this.saga.user, status:'success'}
        };
        this.saga.setState(PurchesState.Purchased, this.saga.courseId);
        return {user: this.saga.user, status:'progress'}

    }

    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("Нельзя отменить платеж в процессе");
    }

}

export class BuyCourseSagStatePurchased extends BuyCourseSagaState {
    public pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        throw new Error("Нельзя оплатить купленный курс");
    }
    public checkPayment(): Promise<{ user: UserEntity;status: PaymentStatus }> {
        throw new Error("нельзя проверить платеж по купленному курсу");
    }
    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("Нельзя отменить купленный курс");
    }
}



export class BuyCourseSagStateCanceled extends BuyCourseSagaState {
    public  pay(): Promise<{ paymentLink: string; user: UserEntity; }> {
        this.saga.setState(PurchesState.Started, this.saga.courseId);
        return this.saga.getState().pay();
    }
    public checkPayment(): Promise<{ user: UserEntity;status: PaymentStatus }> {
        throw new Error("нельзя проверить платеж по отмененному курсу");
    }
    public cancel(): Promise<{ user: UserEntity; }> {
        throw new Error("Нельзя отменить отмененный курс");
    }
}