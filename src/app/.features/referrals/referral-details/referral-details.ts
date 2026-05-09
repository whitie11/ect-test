import { Component, computed, EventEmitter, inject, input, Output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ReferralSuResponse } from '../../../.services/referrals/models/referral-su-response';
import { ReferralsService } from '../../../.services/referrals/referrals-service';
import { ProgressNotes } from '../../progress_notes/progress-notes/progress-notes';
import { ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { Overlay, CdkOverlayOrigin, OverlayRef } from '@angular/cdk/overlay';
import { ChangeStageDialog } from '../change-stage-dialog/change-stage-dialog';
import { ReferralStageUpdateDto } from '../../../.services/referrals/models/referral-stage-update-dto';
import { StageEnum } from '../../../.enums/stage';
import { NewNoteDialog } from '../../progress_notes/components/new-note-dialog/new-note-dialog';
import { NewNoteDTO } from '../../../.dtos/newNoteDTO';
import { ProgressNotesService } from '../../../.services/progress_notes/progress-notes-service';
import { SafeHtmlPipePipe } from '../../../.pipes/safe-html-pipe-pipe';

@Component({
  selector: 'app-referral-details',
  imports: [DatePipe, ProgressNotes, PortalModule, CdkOverlayOrigin, SafeHtmlPipePipe],
  templateUrl: './referral-details.html',
  styleUrl: './referral-details.css',
})

export class ReferralDetails {
  @Output() refreshReferrals = new EventEmitter<number>();

  private referralService = inject(ReferralsService);
  private notesService = inject(ProgressNotesService);

  private overlayRef: OverlayRef | null = null;

  selectedReferralId = input.required<number>();

  selectedReferral = signal<ReferralSuResponse | null>(null);

  refreshNotes = signal<boolean>(true);

  protected changeStageOpen = false;

  stage = signal<StageEnum>(StageEnum.UNKNOWN);

  constructor(private overlay: Overlay) { }

  ngOnInit() {
    console.log('Referral Details component initialized with referral ID:', this.selectedReferralId());
    // You can add logic here to fetch referral details based on selectedReferralId if needed)
  }

  changeStageDialog() {
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
      this.closeDialog();
    });
    componentRef.instance.saveChanges.subscribe((n) => {
      this.saveAllChanges(n.newStage, n.notes);
    });
    this.overlayRef?.backdropClick().subscribe(() => this.overlayRef?.detach());
  }

  newNoteDialog() {
    const target = document.querySelector("#newNoteButton") as HTMLElement;
    this.overlayRef = this.overlay.create({
      hasBackdrop: true,
      backdropClass: "cdk-overlay-dark-backdrop",
      panelClass: "mat-elevation-z8",
      positionStrategy: this.overlay
        .position().global()
        .centerHorizontally().centerVertically()
    });
    const component = new ComponentPortal(NewNoteDialog);
    const componentRef = this.overlayRef.attach(component);
    componentRef.instance.selectedReferralId.set(this.selectedReferralId());
     componentRef.instance.closeDialog.subscribe(() => {
      this.closeDialog();
    });
    componentRef.instance.saveNewNote.subscribe((note) => {
      this.saveNewNoteRef(note);
    });
    this.overlayRef?.backdropClick().subscribe(() => this.overlayRef?.detach());
  }

  onStageChanged(newStage: StageEnum) {
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
        let newRef: ReferralSuResponse = {
          id: res.id,
          serviceUserId: res.serviceUserId,
          serviceUser: res.serviceUser,
          dateReferred: res.dateReferred,
          stage: StageEnum[res.stage as unknown as keyof typeof StageEnum] || StageEnum.UNKNOWN,
          reason: res.reason,
          referrer: res.referrer,
          referrersEmail: res.referrersEmail,
          isOpen: res.isOpen,
          dateClosed: res.dateClosed
        };
        this.selectedReferral.set(newRef);
        this.stage.set(newRef.stage);
        return newRef;
      },
      error: (error) => {
        console.error('Error fetching referral service user:', error);
      }
    });
  });

  closeDialog() {
    this.overlayRef?.detach();
  }

  saveAllChanges(newStage: StageEnum, notes: string) {
    console.log('Saving changes with new stage:', newStage.valueOf(), 'and notes:');
    let refUpdateData: ReferralStageUpdateDto = {
      referralId: this.selectedReferral()?.id || 0,
      // userId: 1,
      currentStage: Object.keys(StageEnum)[Object.values(StageEnum).indexOf(this.stage())],
      newStage: Object.keys(StageEnum)[Object.values(StageEnum).indexOf(newStage)],
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
        this.closeDialog();
      },
      error: (error) => {
        console.error('Error updating referral service user:', error);
      }
    });
  }

    saveNewNoteRef(note: string) {
      const referral = this.selectedReferral?.();
      if(referral === null || !referral) {
        console.error('Cannot save note: selectedReferral is null');
        return;
      }
      let newNoteDTO: NewNoteDTO = {
          referralId: referral.id,
          serviceUserId: referral.serviceUserId,
          notes: note
        }
  
        this.notesService.addNoteReferral(newNoteDTO)?.subscribe({
          next: (data) => {
            console.log("Progress note saved wih Id:", data)
            this.refreshNotes.set(false);
            this.refreshNotes.set(true);
            this.closeDialog();
          },
          error: (error) => {
            console.error('Error updating referral service user:', error);
          }
        });
      }

}