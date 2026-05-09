import { GenderEnum } from "../.enums/gender";

export interface ServiceUser {
    id: number;
    firstname: string;
    lastname: string;
    midname: string;
    dob: Date,
    nhsNo: string;
    gender: GenderEnum
}

export interface ServiceUserModel {
    firstname: string;
    lastname: string;
    midname: string;
    dob: Date | null;
    nhsNo: string;
    gender: GenderEnum
}



