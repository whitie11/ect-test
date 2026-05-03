import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { ReferralsService } from '../../.services/referrals/referrals-service';
import { ReferralRefResponse } from '../../.services/referrals/models/referral-ref-response';
import { ReferralRef } from './referral-ref/referral-ref';
import { ReferralDetails } from './referral-details/referral-details';
import { Router } from '@angular/router';
import { StageEnum } from '../../.enums/stage';


@Component({
  selector: 'app-referrals',
  imports: [ReferralRef, ReferralDetails],
  templateUrl: './referrals.html',
  styleUrl: './referrals.css',
})
export class Referrals {
  private referralService = inject(ReferralsService);
  private router = inject(Router);

 refId = input(0, {transform: numberAttribute});


referrals = signal<ReferralRefResponse[]>([]);
refPending = signal<ReferralRefResponse[]>([]);
refNotAllocated = signal<ReferralRefResponse[]>([]);
refWaiting = signal<ReferralRefResponse[]>([]);
refP = signal<ReferralRefResponse[]>([]);
refB = signal<ReferralRefResponse[]>([]);
refTreatP = signal<ReferralRefResponse[]>([]);
refTreatB = signal<ReferralRefResponse[]>([]);


  selectedReferralId = signal<number>(0);

  ngOnInit() {
    console.log('Referrals component initialized with refId:', this.refId());
    if (!isNaN(this.refId())) {
      this.selectedReferralId.set(this.refId());
    } else {
      console.warn('refId set to 0:');
       this.selectedReferralId.set(0);
    } 


    this.referralService.getAllReferrals().subscribe({
      next: (data) => {

        console.log('Referrals fetched successfully', data);
        const res = JSON.parse(JSON.stringify(data)).referrals;
        let refArray: ReferralRefResponse[] = [];
        res.forEach((ref: ReferralRefResponse) => {
          let newRef: ReferralRefResponse = {
            referralId: ref.referralId,
            serviceUserId: ref.serviceUserId,
            serviceUser: ref.serviceUser,
            dateReferred: ref.dateReferred,
            stage: StageEnum[ref.stage as unknown as keyof typeof StageEnum] || StageEnum.UNKNOWN,
            reason: ref.reason
          };  
          refArray.push(newRef);
        });

        this.referrals.set(refArray);
        this.refPending.set(refArray.filter((ref: ReferralRefResponse) => ref.stage === StageEnum.PENDING));
        this.refNotAllocated.set(refArray.filter((ref: ReferralRefResponse) => ref.stage === StageEnum.NOT_ALLOCATED));
        this.refWaiting.set(refArray.filter((ref: ReferralRefResponse) => ref.stage === StageEnum.WAITING));
        this.refP.set(refArray.filter((ref: ReferralRefResponse) => ref.stage === StageEnum.ACCEPTED_P));
        this.refB.set(refArray.filter((ref: ReferralRefResponse) => ref.stage === StageEnum.ACCEPTED_B));
        this.refTreatP.set(refArray.filter((ref: ReferralRefResponse) => ref.stage === StageEnum.TREATMENT_P));
        this.refTreatB.set(refArray.filter((ref: ReferralRefResponse) => ref.stage === StageEnum.TREATMENT_B));
        let x = this.referrals();
        console.log('Referrals after setting signals:', x);
        console.log('Referrals after filtering:', {
          pending: this.refPending(),
          notAllocated: this.refNotAllocated(),
          waiting: this.refWaiting(),
          acceptedP: this.refP(),
          acceptedB: this.refB(),
          treatmentP: this.refTreatP(),
          treatmentB: this.refTreatB()
        });
      },
      error: (error) => {
        console.error('Error fetching referrals:', error);
      }
    });
  }

  setSelectedReferralId(referralId: number) {
    this.selectedReferralId.set(referralId);
  }

  refreshReferrals(selectedRefId: number) {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['home/referrals/'+ selectedRefId]); 
    });
  }
}