import { ClinicIdEnum } from "../.enums/clinicIdEnum";
import { ConsentEnum, SectionEnum } from "../.enums/section";
import { TreatmentStageEnum } from "../.enums/treatmentStage";
import { Clinic } from "../.features/clinic/clinic";

export interface NewApptDTO {
     date: string;
    clinic: string;
    referralId: number;
    serviceUserId: number;
    treatmentStage: string;
    treatmentNo: number;
    section: string;
    consent: string;
    residing: string;
}