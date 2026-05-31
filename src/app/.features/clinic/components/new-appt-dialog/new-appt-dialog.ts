import { Component, computed, EventEmitter, inject, OnInit, Output, signal } from '@angular/core';
import { ReferralRefResponse } from '../../../../.services/referrals/models/referral-ref-response';
import { ConsentEnum, SectionEnum } from '../../../../.enums/section'
import { DatePipe } from '@angular/common';
import { TreatmentStageEnum } from '../../../../.enums/treatmentStage';
import { ApptService } from '../../../../.services/appointments/appt-service';
import { Appointment } from '../../../../.models/appointment';
import { ClinicIdEnum } from '../../../../.enums/clinicIdEnum';


@Component({
  selector: 'app-new-appt-dialog',
  imports: [
    DatePipe
  ],
  templateUrl: './new-appt-dialog.html',
  styleUrl: './new-appt-dialog.css',
})
export class NewApptDialog  implements OnInit {
  ngOnInit(): void {
    this.getLastAppointmentData(this.ref()?.referralId as number);
  }

  
  private apptService = inject(ApptService);
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
  date = signal<Date | null>(null)
  list = signal<number>(0)

  SectionEnum = SectionEnum;
  sectionOptions = Object.values(this.SectionEnum)
  consentEnum = ConsentEnum;
  consentOptions = Object.values(this.consentEnum)
  treatmentStageEnum = TreatmentStageEnum
  treatmentStageOptions = Object.values(this.treatmentStageEnum)


  treatmentStage = signal<TreatmentStageEnum>(this.treatmentStageEnum.UNKNOWN)
  treatmentNo = signal<number>(0)
  section = signal<SectionEnum>(SectionEnum.UNDEFINED)
  consent = signal<ConsentEnum>(ConsentEnum.UNDEFINED)
  location = signal<string>('')

lastAppt = signal<Appointment | null>(null);

  formNotValid = computed(() => {
    if (
      this.treatmentStage() == TreatmentStageEnum.UNKNOWN
      || this.treatmentNo() < 1
      || this.section() == SectionEnum.UNDEFINED
      || this.consent() == ConsentEnum.UNDEFINED
      || this.location() == ''
    ) {
      return true
    }
    else return false
  })


  getLastAppointmentData(refId: number) {
    let lastAppt: Appointment | null = null;
    this.apptService.getLastAppointment(refId).subscribe({
      next: (data) => {
        const appt: Appointment = JSON.parse(JSON.stringify(data));
          lastAppt = {
            id: appt.id,
            referralId: appt.referralId,
            date: new Date(appt.date),
            clinic: ClinicIdEnum[appt.clinic as unknown as keyof typeof ClinicIdEnum] || ClinicIdEnum.UNDEFINED,
            serviceUserId: appt.serviceUserId,
            serviceUser: appt.serviceUser,
            treatmentStage: TreatmentStageEnum[appt.treatmentStage as unknown as keyof typeof TreatmentStageEnum] || TreatmentStageEnum.UNKNOWN,
            treatmentNo: appt.treatmentNo,
            section: SectionEnum[appt.section as unknown as keyof typeof SectionEnum] || SectionEnum.UNDEFINED,
            consent: ConsentEnum[appt.consent as unknown as keyof typeof ConsentEnum] || ConsentEnum.UNDEFINED,
            residing: appt.residing
          }
          this.lastAppt.set(lastAppt);
       
      },
      error: (error) => {
        console.error('Error fetching referrals:', error);
      }
    });
  }


  doCloseDialog() {  // Logic to close the dialog
    console.log('Dialog closed');
    this.closeDialog.emit();
  }

  updateTreatmentStage(t: TreatmentStageEnum) { this.treatmentStage.set(t) }
  updateTreatmentNo(n: any) {
    let x = n
    if (!isNaN(n) && n != '') {
      this.treatmentNo.set(parseInt(n))
    }
  }

  updateSection(s: SectionEnum) { this.section.set(s) }
  updateConsent(c: ConsentEnum) { this.consent.set(c) }
  updateLocation(l: string) { this.location.set(l) }

  onSubmit() {
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
