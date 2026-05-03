import { Component, inject, Input, signal } from '@angular/core';
import { Appointment } from '../../.models/appointment';
import { ApptService } from '../../.services/appointments/appt-service';
import { DatePipe } from '@angular/common';
import { AgePipe } from '../../.pipes/age-pipe';
import { ClinicIdEnum } from '../../.enums/clinicIdEnum';
import { TreatmentStageEnum } from '../../.enums/treatmentStage';
import { ConsentEnum, SectionEnum } from '../../.enums/section';

@Component({
  selector: 'app-treatment',
  imports: [DatePipe,
    AgePipe
  ],
  templateUrl: './treatment.html',
  styleUrl: './treatment.css',
})
export class Treatment {
private apptService = inject(ApptService);
@Input()
apptId: number | null = null;

appt = signal<Appointment | null>(null);

ngOnInit() {
  console.log('Treatment component initialized with appointment:', this.apptId);
  if (this.apptId !== null  && this.apptId !== undefined  && this.apptId > 0) {
      this.apptService.getAppt(this.apptId).subscribe({
        next: (data) => {
          const appt = JSON.parse(JSON.stringify(data));

           let appointment: Appointment = {
                      id: appt.id,
                      referralId: appt.referralId,
                      date: new Date(appt.date),
                      clinic: ClinicIdEnum[appt.clinic as unknown as keyof typeof ClinicIdEnum] || ClinicIdEnum.UNDEFINED,
                      serviceUserId: appt.serviceUserId,
                      serviceUser: appt.serviceUser,
                      treatmentStage: TreatmentStageEnum[appt.treatmentStage as unknown as keyof typeof TreatmentStageEnum] || TreatmentStageEnum.UNKNOWN,
                      treatmentNo: appt.treatmentNo,
                      section:  SectionEnum[appt.section as unknown as keyof typeof SectionEnum] || SectionEnum.UNDEFINED,
                      consent:    ConsentEnum[appt.consent as unknown as keyof typeof ConsentEnum] || ConsentEnum.UNDEFINED,
                      residing:   appt.residing
                    }
          this.appt.set(appointment);
        },
        error: (error) => {
          console.error('Error fetching referrals:', error);
        }
      });
  } else {
    console.warn('No appointment provided to Treatment component');
  }   
}

}
