import { ServiceUser } from "../../../.models/service-user";

export interface ReferralSuResponse {
    id: number;
    referrer: string;
    referrersEmail: string;
    serviceUserId: number;
    serviceUser: ServiceUser;
    reason: string;
    stage: string;
    isOpen: boolean;
    dateReferred: Date;
    dateClosed: Date | null;
}



