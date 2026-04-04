import { Component, computed, EventEmitter, HostBinding, inject, input, Input, Output, Signal, signal, ViewChild} from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReferralSuResponse } from '../../../.services/referrals/models/referral-su-response';
import { ReferralsService } from '../../../.services/referrals/referrals-service';
import { ProgressNotes } from '../../progress_notes/progress-notes/progress-notes';
import { CdkPortal, ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { Overlay, CdkOverlayOrigin, CdkConnectedOverlay, OverlayRef } from '@angular/cdk/overlay';
import { ChangeStageDialog } from '../change-stage-dialog/change-stage-dialog';
import { ReferralStageUpdateDto } from '../../../.services/referrals/models/referral-stage-update-dto';
import { R } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-referral-details',
  imports: [DatePipe, ProgressNotes, PortalModule, CdkOverlayOrigin],
  templateUrl: './referral-details.html',
  styleUrl: './referral-details.css',
}) 


export class ReferralDetails {
@Output() refreshReferrals = new EventEmitter<number>();

constructor(private overlay: Overlay) {}  

private overlayRef: OverlayRef | null = null;

changeStageDialog() {
// const target = document.getElementById('changeStageButton');
const target = document.querySelector("#changeStageButton") as HTMLElement;
this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: "cdk-overlay-dark-backdrop",
      panelClass: "mat-elevation-z8",
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(target)
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top"
          }
        ])
    });
    const component = new ComponentPortal(ChangeStageDialog);
    const componentRef = this.overlayRef.attach(component);
    componentRef.instance.currentStage.set(this.stage());
    componentRef.instance.newStage.subscribe((value) => {
      this.onStageChanged(value);
    });
    componentRef.instance.closeDialog.subscribe(() => {
      this.closeChangeStageDialog();
    });
    componentRef.instance.saveChanges.subscribe((n) => {
      this.saveAllChanges(n.newStage, n.notes);
    }); 
    this.overlayRef?.backdropClick().subscribe(() => this.overlayRef?.detach());
}


selectedReferralId = input.required<number>();

private referralService = inject(ReferralsService);

selectedReferral = signal<ReferralSuResponse | null>(null);

protected changeStageOpen = false;

// Test
stage = signal<string>('');

onStageChanged(newStage: string) {
  console.log('Stage changed to:', newStage);
  this.stage.set(newStage);  
  if (this.selectedReferral()) {
    this.selectedReferral.update(prev => prev ? { ...prev, stage: newStage } : null);
  }
}


  selectedReferralComputed = computed(() => {
    if (this.selectedReferralId() === 0) {
      return null;
    }
    return this.referralService.getReferralServiceUser(this.selectedReferralId()).subscribe({
        next: (data) => {
          console.log('Referral Service User fetched successfully', data);
          const res = JSON.parse(JSON.stringify(data));
          this.selectedReferral.set(res);
          this.stage.set(res.stage); 
          return res;  
        },
        error: (error) => {
          console.error('Error fetching referral service user:', error);
        }
      });
    } ); 

  ngOnInit() {
    console.log('Referral Details component initialized with referral ID:', this.selectedReferralId());
    // You can add logic here to fetch referral details based on selectedReferralId if needed)
}

closeChangeStageDialog() {
  this.overlayRef?.detach();
}

saveAllChanges(newStage: string, notes: string) {
  console.log('Saving changes with new stage:', newStage, 'and notes:');
  let refUpdateData: ReferralStageUpdateDto = {
    referralId: this.selectedReferral()?.id || 0,
    // userId: 1,
    currentStage: this.selectedReferral()?.stage || '',
    newStage: newStage,
    notes: notes 
  };
  this.referralService.updateReferralStage(refUpdateData)?.subscribe({
        next: (data) => {
          console.log('Referral Service updated successfully', data);
          // const res = JSON.parse(JSON.stringify(data));
          // this.selectedReferral.set(res);
          // this.stage.set(res.stage); 
        let refId = this.selectedReferralId();
          this.refreshReferrals.emit(refId);
          this.closeChangeStageDialog();
        },
        error: (error) => {
          console.error('Error updating referral service user:', error);
        }
      });   
}



}