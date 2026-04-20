import { ServiceUser } from "../../../.models/service-user";

export interface ReferralRefResponse {
    referralId: number;
    serviceUserId: number;
     serviceUser: ServiceUser;
    // firstName: string;
    // midName: string;
    // lastName: string;
    // nhsNo: string;
    stage: string;
    reason: string;
    dateReferred: Date;
}