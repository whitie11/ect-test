import { ClinicIdEnum } from "../.enums/clinicIdEnum";
import { ConsentEnum, SectionEnum } from "../.enums/section";
import { TreatmentStageEnum } from "../.enums/treatmentStage";
import { ServiceUser } from "./service-user";

export interface Appointment {
    referralId: number;
    date: Date;
    clinic: ClinicIdEnum;
    serviceUserId: number;
     serviceUser: ServiceUser;
    // firstName: string;
    // midName: string;
    // lastName: string;
    // nhsNo: string;
    treatmentStage: TreatmentStageEnum
    treatmentNo: number;
    section: SectionEnum;
    consent: ConsentEnum;
    residing: string
}

