import { Component, computed, EventEmitter, Output, signal } from '@angular/core';
import { ReferralRefResponse } from '../../../../.services/referrals/models/referral-ref-response';
import {Consent, Section} from '../../../../.enums/section'
import { DatePipe } from '@angular/common';
import { TreatmentStage } from '../../../../.enums/treatmentStage';

  
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
    treatmentStage: TreatmentStage;
    treatmentNo: number;
    date: Date;
    section: Section;
    consent: Consent;
    location: string
  }>();


ref = signal<ReferralRefResponse | null>(null);
date = signal<Date| null>(null)
list = signal<number>(0)

SectionEnum = Section;
sectionOptions = Object.values(this.SectionEnum)
ConsentEnum = Consent;
consentOptions = Object.values(this.ConsentEnum)
treatmentStageEnum = TreatmentStage
treatmentStageOptions = Object.values(this.treatmentStageEnum)


treatmentStage = signal<TreatmentStage>(this.treatmentStageEnum.UNKNOWN)
treatmentNo = signal<number>(0)
section = signal<Section>(Section.UNDEFINED)
consent = signal<Consent>(Consent.UNDEFINED)
location = signal<string>('')

formNotValid = computed(() => {
  if(
    this.treatmentStage() == TreatmentStage.UNKNOWN
    || this.treatmentNo()<1 
    || this.section() == Section.UNDEFINED
    || this.consent() == Consent.UNDEFINED
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

  updateTreatmentStage(t: TreatmentStage){this.treatmentStage.set(t)}
  updateTreatmentNo(n: any){
    let x = n
    if(!isNaN(n) && n !='') {
       this.treatmentNo.set(parseInt(n))
    }
  }
   
  updateSection(s: Section){this.section.set(s)}
  updateConsent(c: Consent){this.consent.set(c)}
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
