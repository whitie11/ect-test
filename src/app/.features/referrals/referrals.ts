import { Component, computed, inject, input, numberAttribute, signal } from '@angular/core';
import { ReferralsService } from '../../.services/referrals/referrals-service';
import { ReferralRefResponse } from '../../.services/referrals/models/referral-ref-response';
import { ReferralRef } from './referral-ref/referral-ref';
import { ReferralDetails } from './referral-details/referral-details';
import { Router } from '@angular/router';
import { transform } from 'typescript';

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
      console.warn('Invalid refId input:', this.refId());
       this.selectedReferralId.set(0);
    } 


    this.referralService.getAllReferrals().subscribe({
      next: (data) => {

        console.log('Referrals fetched successfully', data);
        const res = JSON.parse(JSON.stringify(data)).referrals;
        this.referrals.set(res);
        this.refPending.set(res.filter((ref: ReferralRefResponse) => ref.stage === 'PENDING'));
        this.refNotAllocated.set(res.filter((ref: ReferralRefResponse) => ref.stage === 'NOT_ALLOCATED'));
        this.refWaiting.set(res.filter((ref: ReferralRefResponse) => ref.stage === 'WAITING'));
        this.refP.set(res.filter((ref: ReferralRefResponse) => ref.stage === 'ACCEPTED_P'));
        this.refB.set(res.filter((ref: ReferralRefResponse) => ref.stage === 'ACCEPTED_B'));
        this.refTreatP.set(res.filter((ref: ReferralRefResponse) => ref.stage === 'TREATMENT_P'));
        this.refTreatB.set(res.filter((ref: ReferralRefResponse) => ref.stage === 'TREATMENT_B'));
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