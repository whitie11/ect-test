import { Component, input, Input, Signal } from '@angular/core';
import { ProgressNotesResponse } from '../../../../.services/progress_notes/models/progress_notes_response';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notes-card',
  imports: [DatePipe],
  templateUrl: './notes-card.html',
  styleUrl: './notes-card.css',
})
export class NotesCard {
// @Input({ required: true }) note!: ProgressNotesResponse;
note = input.required<ProgressNotesResponse>();
}
