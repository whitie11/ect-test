import { Component, Input } from '@angular/core';
import { ReferralRefResponse } from '../../../.services/referrals/models/referral-ref-response';
import { DatePipe } from '@angular/common';
import { StageEnum } from '../../../.enums/stage';

@Component({
       selector: 'app-referral-ref',
       imports: [DatePipe],
       templateUrl: './referral-ref.html',
       styleUrl: './referral-ref.css',
})
export class ReferralRef {
       @Input()
       referral: ReferralRefResponse | null = null;

       bgColour(refStage: StageEnum | undefined) {
              if (refStage) {
                     switch (refStage as StageEnum) {
                            case StageEnum.NOT_ALLOCATED:
                                   return "Red";
                                   break;
                            case StageEnum.PENDING:
                                   return "Red";
                                   break;
                            case StageEnum.WAITING:
                                   return "Orange";
                                   break;
                            case StageEnum.ACCEPTED_B:
                                   return "Green";
                                   break;
                            case StageEnum.ACCEPTED_P:
                                   return "Green";
                                   break;
                            case StageEnum.TREATMENT_B:
                                   return "bg-primary";
                                   break;
                            case StageEnum.TREATMENT_P:
                                   return "bg-primary";
                                   break;
                         
                     }
              }
             return "bg-primary" 
       }

}
