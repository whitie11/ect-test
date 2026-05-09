import { GenderEnum } from "../.enums/gender";

export interface NewServiceUserDTO {
    firstname: string;
    lastname: string;
    midname: string;
    dob: string;
    nhsNo: string; 
    gender: string 
}