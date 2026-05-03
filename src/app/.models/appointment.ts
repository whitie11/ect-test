import { ClinicIdEnum } from "../.enums/clinicIdEnum";
import { ConsentEnum, SectionEnum } from "../.enums/section";
import { TreatmentStageEnum } from "../.enums/treatmentStage";
import { ServiceUser } from "./service-user";

export interface Appointment {
    id: number;
    referralId: number;
    date: Date;
    clinic: ClinicIdEnum;
    serviceUserId: number;
    serviceUser: ServiceUser;
    treatmentStage: TreatmentStageEnum
    treatmentNo: number;
    section: SectionEnum;
    consent: ConsentEnum;
    residing: string
}

