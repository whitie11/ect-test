import { StageEnum } from "../../../.enums/stage";

export interface ReferralStageUpdateDto{
referralId: number;
// userId: number;
currentStage: string;
newStage: string;
notes: string;   
}
