import { CdkDrag, CdkDragDrop, CdkDropList } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, computed, effect, EventEmitter, inject, Input, input, numberAttribute, OnChanges, Output, signal, SimpleChanges, ViewChild } from '@angular/core';
import { ReferralsService } from '../../.services/referrals/referrals-service';
import { Router } from '@angular/router';
import { ReferralRefResponse } from '../../.services/referrals/models/referral-ref-response';
import { ReferralRef } from '../referrals/referral-ref/referral-ref';
import { Appointment } from '../../.models/appointment';
import { DatePipe } from '@angular/common';
import { CdkPortal, ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { NewApptDialog } from '../treatment/components/new-appt-dialog/new-appt-dialog';
import { TreatmentStageEnum } from '../../.enums/treatmentStage';
import { ConsentEnum, SectionEnum } from '../../.enums/section';
import { ReferralStageUpdateDto } from '../../.services/referrals/models/referral-stage-update-dto';
import { StageEnum } from '../../.enums/stage';
import { ClinicIdEnum } from '../../.enums/clinicIdEnum';
import { ApptService } from '../../.services/appointments/appt-service';
import { NewApptDTO } from '../../.dtos/newApptDTO';
import { FuncsService} from '../../.utils/getEnumKeyByEnumValue';
import { CommonModule } from '@angular/common';

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

export class Clinic implements OnChanges {
  private referralService = inject(ReferralsService);
  private apptService = inject(ApptService);
  private router = inject(Router);
  private datePipe = inject(DatePipe);
  @Input()
  public clinicIdEnum = ClinicIdEnum.UNDEFINED
  
  

  constructor(
    private overlay: Overlay,
    private funcsService: FuncsService,
    
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['clinicIdEnum']) {
      const newClinicId = changes['clinicIdEnum'].currentValue;
      console.log('clinicIdEnum changed to:', newClinicId);
      if (newClinicId == ClinicIdEnum.UNDEFINED) {
        console.warn('Invalid clinicId input:', newClinicId);
      }
      else {
        this.selectedClinic.set(newClinicId);
        this.getClinicReferrals(newClinicId);
        this.diaryStart.set(this.adjDate(new Date()))
      }
    }
  }

  ngOnInit() {
    console.log('Clinic component initialized with clinicId:', this.clinicIdEnum);
    if (this.clinicIdEnum == ClinicIdEnum.UNDEFINED) {
      console.warn('Invalid clinicId input:', this.clinicIdEnum);
    }
    else {
      this.getClinicReferrals(this.clinicIdEnum)
      this.diaryStart.set(this.adjDate(new Date()))
      this.getAllAppointments()
    }

  }



  selectedClinic = signal<ClinicIdEnum>(this.clinicIdEnum);

  referrals = signal<ReferralRefResponse[]>([]);
  pendingReferrals = signal<ReferralRefResponse[]>([]);

  diaryStart = signal<Date>(this.adjDate(new Date()));

  apptDate1 = computed(() => {
    let d = new Date(this.diaryStart())
    return d
  })

  apptDate2 = computed(() => {
    let newDate = new Date(this.diaryStart())
    let day = newDate.getDay()
    if (day == 1 || day == 2) {
      //mon or tue
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
    if (day== 1 || day == 2) {
      //mon or tue
      return new Date(newDate.setDate(newDate.getDate() + 10))
    }
    else return new Date(newDate.setDate(newDate.getDate() + 11))
  })

  apptListAll = signal<Appointment[]>([]);
  apptList1 = computed(() => {

    let x = this.apptListAll()
    let z = this.diaryStart()
    console.log('apptListAll: ', x)
    let y = this.apptDate1().toISOString()
    console.log('diaryStart: ', this.diaryStart())
    console.log('apptDate1: ', y)

    let filtered = x.filter(t => this.apptDate1().toLocaleDateString() == (new Date(t.date).toLocaleDateString()))
    console.log('filtered: ', filtered)
    return filtered
  })
  apptList2 = computed(() => {
    let x = this.apptListAll()
    let y = this.apptDate2().toISOString()
    let z = this.diaryStart()
    return this.apptListAll().filter(t => this.apptDate2().toLocaleDateString() == (new Date(t.date).toLocaleDateString()))
  })
  apptList3 = computed(() => {
    let x = this.apptListAll()
    let y = this.apptDate3().toISOString()
    let z = this.diaryStart()
    return this.apptListAll().filter(t => this.apptDate3().toLocaleDateString() == (new Date(t.date).toLocaleDateString()))
  })
  apptList4 = computed(() => {
    let x = this.apptListAll()
    let y = this.apptDate4().toISOString()
    let z = this.diaryStart()
    return this.apptListAll().filter(t => this.apptDate4().toLocaleDateString() == (new Date(t.date).toLocaleDateString()))
  })

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
      if (!this.apptList1().some(item => item.referralId == ref.referralId)) {
        const ts = this.showNewTreatmentDialog(ref, this.apptDate1(), 1);
      }
    }


    if (event.container.id === 'list 2') {
      let itemCount= 0
      let appList = this.apptList2() as unknown as Appointment[]
      if (appList.length > 0) {
        console.log('apptList2: ', appList)
        appList.forEach(element2 => {
         let  x = element2.referralId
         console.log('x. = ', x)
           if (x == ref.referralId) {
            console.warn('Appointment already exists for this referral on this date');
              itemCount++
           }
        });
      }
      if (itemCount == 0) {
        const ts = this.showNewTreatmentDialog(ref, this.apptDate2(), 2);
      }
    }

      if (event.container.id === 'list 3') {
        if (!this.apptList3().some(item => item.date.toLocaleDateString() == this.apptDate3().toLocaleDateString() && item.referralId == ref.referralId)) {
          const ts = this.showNewTreatmentDialog(ref, this.apptDate3(), 3);
        }
      }
      if (event.container.id === 'list 4') {
        if (!this.apptList4().some(item => item.date.toLocaleDateString() == this.apptDate4().toLocaleDateString() && item.referralId == ref.referralId)) {
          const ts = this.showNewTreatmentDialog(ref, this.apptDate4(), 4);
        }
      }
    }

    showNewTreatmentDialog(ref: ReferralRefResponse, date: Date, list: number) {
      this.newTreatmentDialog(ref, date)
    }

    newTreatmentSession(
      ref: ReferralRefResponse,
      treatmentStage: TreatmentStageEnum,
      treatmentNo: number,
      date: Date,
      section: SectionEnum,
      consent: ConsentEnum,
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

        const newAppt: Appointment = {
          clinic: this.clinicIdEnum,
          referralId: ref.referralId,
          date: date,
          serviceUserId: ref.serviceUserId,
          serviceUser: ref.serviceUser,
          // firstName: ref.firstName,
          // midName: ref.midName,
          // lastName: ref.lastName,
          // nhsNo: ref.nhsNo,
          treatmentStage: treatmentStage,
          treatmentNo: treatmentNo,
          section: section,
          consent: consent,
          residing: location
        }

        this.apptListAll.update(values => [...values, newAppt]);

        //TODO add to db
        let newApptDTO: NewApptDTO = {
          clinic: this.funcsService.getEnumKeyByEnumValue(ClinicIdEnum, this.clinicIdEnum) || '',
          referralId: ref.referralId,
          date: this.datePipe.transform(date,"yyyy-MM-dd") || '',
          serviceUserId: ref.serviceUserId,
          treatmentStage: this.funcsService.getEnumKeyByEnumValue(TreatmentStageEnum, treatmentStage) || '',
          treatmentNo: treatmentNo,
          section: this.funcsService.getEnumKeyByEnumValue(SectionEnum, section) || '',
          consent: this.funcsService.getEnumKeyByEnumValue(ConsentEnum, consent) || '',
          residing: location
        };

      let newApptString = JSON.stringify(newApptDTO)
      console.log('New Appointment DTO: ', newApptDTO) 
      console.log('New Appointment DTO Stringified: ', newApptString) 
      this.saveApptToDb(newApptDTO) 
      
      }
    }

    saveApptToDb(apptDTO: NewApptDTO) {
      this.apptService.saveAppt(apptDTO)?.subscribe({
        next: (data) => {
          console.log('Appointment saved successfully', data);
        },
        error: (error) => {
          console.error('Error saving appointment:', error);
        }
      });
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
      if (this.clinicIdEnum == ClinicIdEnum.AVONDALE) {
        switch (day) {
          case 0: //sun
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
      } else if (this.clinicIdEnum == ClinicIdEnum.PENDLEVIEW) {
        switch (day) {
          case 0: //sun
            newDate.setDate(newDate.getDate() + 1);
            break;
          case 1: //mon
            newDate.setDate(newDate.getDate() + 0);
            break;
          case 2: //tue
            newDate.setDate(newDate.getDate() + 2);
            break;
          case 3: //wed
            newDate.setDate(newDate.getDate() + 1);
            break;
          case 4: //thu
            newDate.setDate(newDate.getDate() + 4);
            break;
          case 5: //fri
            newDate.setDate(newDate.getDate() + 3);
            break;
          case 6: //sat
            newDate.setDate(newDate.getDate() + 2);
            break;
        }
      }
      return newDate
    }

    getAllAppointments() {
      this.apptService.getAllAppointments().subscribe({
        next: (data) => {
          console.log('Apptsfetched successfully', data);
          const res: Appointment[] = JSON.parse(JSON.stringify(data));
          let apptArray: Appointment[] = []
          
          res.forEach((appt: Appointment) => {
          let newAppt: Appointment = {
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
          apptArray.push(newAppt)
        }),
          this.apptListAll.set(apptArray)
        },
        error: (error) => {
          console.error('Error fetching referrals:', error);
        }
      });
    }


  }