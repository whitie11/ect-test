export interface ReferralRefResponse {
    referralId: number;
    serviceUserId: number;
    firstName: string;
    midName: string;
    lastName: string;
    nhsNo: string;
    stage: string;
    reason: string;
    dateReferred: Date;
}