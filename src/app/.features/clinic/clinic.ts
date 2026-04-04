import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, computed, EventEmitter, inject, Input, input, numberAttribute, Output, signal, ViewChild } from '@angular/core';
import { ReferralsService } from '../../.services/referrals/referrals-service';
import { Router } from '@angular/router';
import { ReferralRefResponse } from '../../.services/referrals/models/referral-ref-response';
import { ReferralRef } from '../referrals/referral-ref/referral-ref';
import { Appointment } from '../../.models/appointment';
import { DatePipe } from '@angular/common';
import { CdkPortal, ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { NewApptDialog } from '../treatment/components/new-appt-dialog/new-appt-dialog';
import { TreatmentStage } from '../../.enums/treatmentStage';
import { Consent, Section } from '../../.enums/section';
import { ReferralStageUpdateDto } from '../../.services/referrals/models/referral-stage-update-dto';
import { Stage } from '../../.enums/stage';
import { ClinicIdEnum } from '../../.enums/clinicIdEnum';


@Component({
  selector: 'app-clinic',
  imports: [
    CdkDrag,
    CdkDropList,
    ReferralRef,
    DatePipe
  ],
  templateUrl: './clinic.html',
  styleUrl: './clinic.css',
})
export class Clinic {
  private referralService = inject(ReferralsService);
  private router = inject(Router);

  @Input()
  public clinicIdEnum = ClinicIdEnum.UNDEFINED
  selectedClinic = computed(() => {
    return this.clinicIdEnum
  })

  referrals = signal<ReferralRefResponse[]>([]);
  pendingReferrals = signal<ReferralRefResponse[]>([]);

  diaryStart = signal<Date>(new Date())

  apptDate1 = computed(() => {
    let d = new Date(this.diaryStart())
    return d
  })

  apptDate2 = computed(() => {
    let newDate = new Date(this.diaryStart())
    let day = newDate.getDay()
    if (day == 2) {
      //tue
      return new Date(newDate.setDate(newDate.getDate() + 3))
    }
    else return new Date(newDate.setDate(newDate.getDate() + 4))
  })

  apptDate3 = computed(() => {
    let newDate = new Date(this.diaryStart())
    return new Date(newDate.setDate(newDate.getDate() + 7))
  })

  apptDate4 = computed(() => {
    let newDate = new Date(this.diaryStart())
    let day = newDate.getDay()
    if (day == 2) {
      //tue
      return new Date(newDate.setDate(newDate.getDate() + 10))
    }
    else return new Date(newDate.setDate(newDate.getDate() + 11))
  })

  apptListAll = signal<Appointment[]>([]);

  apptList1 = computed(() => {

    let x = this.apptListAll()
    let z = this.diaryStart()
    let filtered = x.filter(t => this.apptDate1().toISOString() == t.date.toISOString())
    console.log('filtered: ', filtered)
    return filtered
  })

  apptList2 = computed(() => {
    let x = this.apptListAll()
    let y = this.apptDate2().toISOString()
    let z = this.diaryStart()
    return this.apptListAll().filter(t => t.date.toISOString() == y)
  })
  apptList3 = computed(() => {
    let x = this.apptListAll()
    let y = this.apptDate3().toISOString()
    let z = this.diaryStart()
    return this.apptListAll().filter((t) => t.date.toISOString() == y)
  })
  apptList4 = computed(() => {
    let x = this.apptListAll()
    let y = this.apptDate4().toISOString()
    let z = this.diaryStart()
    return this.apptListAll().filter((t) => t.date.toISOString() == y)
  })



  constructor(private overlay: Overlay) { }

  private overlayRef: OverlayRef | null = null;

  newTreatmentDialog(ref: ReferralRefResponse, date: Date) {
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: "cdk-overlay-dark-backdrop",
      panelClass: "mat-elevation-z8",
      positionStrategy: this.overlay
        .position()
        .global()
        .centerHorizontally()
        .centerVertically(),
      scrollStrategy: this.overlay.scrollStrategies.block(),
      minWidth: 500,
    });
    const component = new ComponentPortal(NewApptDialog);
    const componentRef = this.overlayRef.attach(component);
    componentRef.instance.ref.set(ref);
    componentRef.instance.date.set(date)
    componentRef.instance.closeDialog.subscribe(() => {
      this.closeNewTreatmentDialog();
    });
    componentRef.instance.saveChanges.subscribe((n) => {
      this.newTreatmentSession(
        n.ref,
        n.treatmentStage,
        n.treatmentNo,
        n.date,
        n.section,
        n.consent,
        n.location
      );
    });
    this.overlayRef?.backdropClick().subscribe(() => this.overlayRef?.detach());
  }

  closeNewTreatmentDialog() {
    this.overlayRef?.detach();
  }

  ngOnInit() {
    console.log('Clinic component initialized with clinicId:', this.clinicIdEnum);
    if (this.clinicIdEnum == ClinicIdEnum.UNDEFINED) {
      console.warn('Invalid clinicId input:', this.clinicIdEnum);
    }
    else {
      this.getClinicReferrals(this.clinicIdEnum)
      this.diaryStart.set(this.adjDate(new Date()))
    }
  }

  getClinicReferrals(clinicIdEnum: ClinicIdEnum) {
    let pendingReferrals = ''
    let treatingReferrals = ''

    switch (clinicIdEnum) {
      case ClinicIdEnum.AVONDALE:
        pendingReferrals = 'ACCEPTED_P';
        treatingReferrals = 'TREATMENT_P';
        break
      case ClinicIdEnum.PENDLEVIEW:
        pendingReferrals = 'ACCEPTED_B';
        treatingReferrals = 'TREATMENT_B';
        break
      default:
        pendingReferrals = '';
    }

    if (pendingReferrals != '') {
      console.log('Getting Data');
      this.referralService.getReferralsByStage(treatingReferrals).subscribe({
        next: (data) => {
          console.log('Referrals fetched successfully', data);
          const res = JSON.parse(JSON.stringify(data));
          this.referrals.set(res);
          // this.apptListAll.set([]) 
          // this.treatmentListAll.set([])  // TODO update this from db
        },
        error: (error) => {
          console.error('Error fetching referrals:', error);
        }
      });
      this.referralService.getReferralsByStage(pendingReferrals).subscribe({
        next: (data) => {
          console.log('Referrals fetched successfully', data);
          const res = JSON.parse(JSON.stringify(data));
          this.pendingReferrals.set(res);
          // this.selectedReferrals.set([])
        },
        error: (error) => {
          console.error('Error fetching referrals:', error);
        }
      });
    }
    else console.warn('Error with clinic name')
  }

  drop(event: CdkDragDrop<ReferralRef>) {
    let x = event.container.id
    let data = event.previousIndex
    let ref: ReferralRefResponse
    if (event.previousContainer.id === 'list -1') {
      ref = this.pendingReferrals()[data]
    }
    else {
      ref = this.referrals()[data]
    }

    if (event.container.id === 'list 1') {
      // let data = event.previousIndex
      // let ref = this.referrals()[data]
      let itemAlreadyExist = this.apptList1().find(
        item => item.date.toISOString() == this.apptDate1().toISOString()
          && (ref.referralId == item.refId)
      );
      if (!itemAlreadyExist) {
        const ts = this.showNewTreatmentDialog(ref, this.apptDate1(), 1)
      }
    }
    if (event.container.id === 'list 2') {
      // let data = event.previousIndex
      // let ref = this.referrals()[data]
      let itemAlreadyExist = this.apptList2().find(
        item => item.date.toISOString() == this.apptDate2().toISOString()
          && (ref.referralId == item.refId)
      );
      if (!itemAlreadyExist) {
        const ts = this.showNewTreatmentDialog(ref, this.apptDate2(), 2)
      }
    }
    if (event.container.id === 'list 3') {
      // let data = event.previousIndex
      // let ref = this.referrals()[data]
      let itemAlreadyExist = this.apptList3().find(
        item => item.date.toISOString() == this.apptDate3().toISOString()
          && (ref.referralId == item.refId)
      );
      if (!itemAlreadyExist) {
        const ts = this.showNewTreatmentDialog(ref, this.apptDate3(), 3)
      }
    }
    if (event.container.id === 'list 4') {
      // let data = event.previousIndex
      // let ref = this.referrals()[data]
      let itemAlreadyExist = this.apptList4().find(
        item => item.date.toISOString() == this.apptDate4().toISOString()
          && (ref.referralId == item.refId)
      );
      if (!itemAlreadyExist) {
        const ts = this.showNewTreatmentDialog(ref, this.apptDate4(), 4)
      }
    }
  }

  showNewTreatmentDialog(ref: ReferralRefResponse, date: Date, list: number) {
    this.newTreatmentDialog(ref, date)
  }

  newTreatmentSession(
    ref: ReferralRefResponse,
    treatmentStage: TreatmentStage,
    treatmentNo: number,
    date: Date,
    section: Section,
    consent: Consent,
    location: string
  ) {

    // TO find if item in pending list and delete then add to treatment list
    // Or update ref stage and reload referral lists
    // referralService.updateReferralStage(ref: ReferralStageUpdateDto)  
    // i.e getClinicReferrals(id: number) 

    if (this.clinicIdEnum == ClinicIdEnum.UNDEFINED) {
      return
    } else {

      let currentStage = ''
      let newStage = ''
      if (this.clinicIdEnum == ClinicIdEnum.AVONDALE) {
        currentStage = "ACCEPTED_P"
        newStage = "TREATMENT_P"
      } else {
        currentStage = "ACCEPTED_B"
        newStage = "TREATMENT_B"
      }

      let refUpdateData: ReferralStageUpdateDto = {
        referralId: ref.referralId,
        currentStage: currentStage,
        newStage: newStage,
        notes: "First Appointment"
      };

      this.referralService.updateReferralStage(refUpdateData)?.subscribe({
        next: (data) => {
          console.log('Referral Service updated successfully', data);
          this.getClinicReferrals(this.clinicIdEnum)
        },
        error: (error) => {
          console.error('Error updating referral service user:', error);
        }
      });

      const ts: Appointment = {
        clinic: this.clinicIdEnum,
        refId: ref.referralId,
        date: date,
        serviceUserId: ref.serviceUserId,
        firstName: ref.firstName,
        midName: ref.midName,
        lastName: ref.lastName,
        nhsNo: ref.nhsNo,
        treatmentStage: treatmentStage,
        treatmentNo: treatmentNo,
        section: section,
        consent: consent,
        residing: location
      }

      this.apptListAll.update(values => [...values, ts]);

      //TODO add to db
    }
  }

  getLastTreatmentData(refId: number) {

  }

  addDate() {
    this.diaryStart.set(this.adjDate(new Date(this.diaryStart().setDate(this.diaryStart().getDate() + 1))))

  }

  subtractDate() {
    this.diaryStart.set(this.adjDate(new Date(this.diaryStart().setDate(this.diaryStart().getDate() - 4))))

  }

  adjDate(date: Date) {
    let newDate = new Date(date)
    let day = newDate.getDay()
    switch (day) {
      case 0:
        newDate.setDate(newDate.getDate() + 2);
        break;
      case 1:
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 2:
        newDate.setDate(newDate.getDate() + 0);
        break;
      case 3:
        newDate.setDate(newDate.getDate() + 2);
        break;
      case 4:
        newDate.setDate(newDate.getDate() + 1);
        break;
      case 5:
        newDate.setDate(newDate.getDate() + 0);
        break;
      case 6:
        newDate.setDate(newDate.getDate() + 3);
        break;
    }
    return newDate
  }

}


