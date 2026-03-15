import { Component, computed, inject, Input, signal, Signal } from '@angular/core';
import { ProgressNotesResponse } from '../../../.services/progress_notes/models/progress_notes_response';
import { ProgressNotesService } from '../../../.services/progress_notes/progress-notes-service';
import { NotesCard } from '../components/notes-card/notes-card';

@Component({
  selector: 'app-progress-notes',
  imports: [NotesCard],
  templateUrl: './progress-notes.html',
  styleUrl: './progress-notes.css',
})
export class ProgressNotes {
@Input({ required: true }) selectedReferralId!:  Signal<number>;

private notesService = inject(ProgressNotesService);

notes = signal<ProgressNotesResponse[]>([]);

selectedNotesComputed = computed(() => {
  console.log('Selected Referral ID in Progress Notes:', this.selectedReferralId());    
  if (this.selectedReferralId() === 0) {
      return null;
    }
    return this.notesService.getNotesForReferral(this.selectedReferralId()).subscribe({
        next: (data) => {
          console.log('Progress Notes fetched successfully', data);
          const res = JSON.parse(JSON.stringify(data));
          this.notes.set(res); 
          return res;  
        },
        error: (error) => {
          console.error('Error fetching referral service user:', error);
        }
      });
});
}
