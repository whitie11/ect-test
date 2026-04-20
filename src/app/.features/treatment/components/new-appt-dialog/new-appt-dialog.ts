import { Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { ReferralRefResponse } from '../../../../.services/referrals/models/referral-ref-response';
import {ConsentEnum, SectionEnum} from '../../../../.enums/section'
import { DatePipe } from '@angular/common';
import { TreatmentStageEnum } from '../../../../.enums/treatmentStage';

  
@Component({
  selector: 'app-new-appt-dialog',
  imports: [
     DatePipe
  ],
  templateUrl: './new-appt-dialog.html',
  styleUrl: './new-appt-dialog.css',
})
export class NewApptDialog {
  @Output() closeDialog = new EventEmitter();
  @Output() saveChanges = new EventEmitter<{
    ref: ReferralRefResponse;
    treatmentStage: TreatmentStageEnum;
    treatmentNo: number;
    date: Date;
    section: SectionEnum;
    consent: ConsentEnum;
    location: string
  }>();


ref = signal<ReferralRefResponse | null>(null);
date = signal<Date| null>(null)
list = signal<number>(0)

SectionEnum = SectionEnum;
sectionOptions = Object.values(this.SectionEnum)
ConsentEnum = ConsentEnum;
consentOptions = Object.values(this.ConsentEnum)
treatmentStageEnum = TreatmentStageEnum
treatmentStageOptions = Object.values(this.treatmentStageEnum)


treatmentStage = signal<TreatmentStageEnum>(this.treatmentStageEnum.UNKNOWN)
treatmentNo = signal<number>(0)
section = signal<SectionEnum>(SectionEnum.UNDEFINED)
consent = signal<ConsentEnum>(ConsentEnum.UNDEFINED)
location = signal<string>('')

formNotValid = computed(() => {
  if(
    this.treatmentStage() == TreatmentStageEnum.UNKNOWN
    || this.treatmentNo()<1 
    || this.section() == SectionEnum.UNDEFINED
    || this.consent() == ConsentEnum.UNDEFINED
    || this.location() == ''
  ){
    return true
  } 
  else return false
})

  doCloseDialog() {  // Logic to close the dialog
    console.log('Dialog closed');
    this.closeDialog.emit();
  }

  updateTreatmentStage(t: TreatmentStageEnum){this.treatmentStage.set(t)}
  updateTreatmentNo(n: any){
    let x = n
    if(!isNaN(n) && n !='') {
       this.treatmentNo.set(parseInt(n))
    }
  }
   
  updateSection(s: SectionEnum){this.section.set(s)}
  updateConsent(c: ConsentEnum){this.consent.set(c)}
  updateLocation(l: string){this.location.set(l)}

  onSubmit(){
let x = this.section()


this.saveChanges.emit({
  ref: this.ref() as ReferralRefResponse,
  treatmentStage: this.treatmentStage(),
  treatmentNo: this.treatmentNo(),
  date: this.date() as Date,
  section: this.section(),
  consent: this.consent(),
  location: this.location()
})
 this.closeDialog.emit();
}
}
