import { RMQService } from "nestjs-rmq";
import { UserEntity } from "../entities/user.entity";
import { PurchesState } from "@purple/interfaces";
import { BuyCourseSagaState } from "./buy-course.state";
import {
    BuyCourseSagStateCanceled,
    BuyCourseSagStateProcess,
    BuyCourseSagStatePurchased,
    BuyCourseSagStateStarted
} from "./buy-course.steps";

export class BuyCourseSaga {
    private state: BuyCourseSagaState;

    constructor(public user: UserEntity,
        public courseId: string, public rmqService: RMQService,
    ) { }

    setState(state: PurchesState, courseId: string) {
        switch (state) {
            case PurchesState.Started:
                this.state = new BuyCourseSagStateStarted();
                break;
            case PurchesState.WaitingForPayment:
                this.state = new BuyCourseSagStateProcess();
                break;
            case PurchesState.Purchased:
                this.state = new BuyCourseSagStatePurchased()
                break;
            case PurchesState.Canceled:
                this.state = new BuyCourseSagStateCanceled();
                break
        }
        this.state.setContext(this)
        this.user.setCourseStatus(courseId, state)
    }
    public getState() {
        return this.state;
    }
}