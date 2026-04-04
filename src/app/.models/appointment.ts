import { ClinicIdEnum } from "../.enums/clinicIdEnum";
import { Consent, Section } from "../.enums/section";
import { TreatmentStage } from "../.enums/treatmentStage";

export interface Appointment {
    refId: number;
    date: Date;
    clinic: ClinicIdEnum;
    serviceUserId: number;
    firstName: string;
    midName: string;
    lastName: string;
    nhsNo: string;
    treatmentStage: TreatmentStage
    treatmentNo: number;
    section: Section;
    consent: Consent;
    residing: string
}

