import { StageEnum } from "../../../.enums/stage";
import { ServiceUser } from "../../../.models/service-user";

export interface ReferralRefResponse {
    referralId: number;
    serviceUserId: number;
    serviceUser: ServiceUser;
    stage: StageEnum;
    reason: string;
    dateReferred: Date;
}