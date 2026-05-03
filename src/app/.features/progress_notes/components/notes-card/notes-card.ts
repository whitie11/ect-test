import { Component, input, Input, Signal } from '@angular/core';
import { ProgressNotesResponse } from '../../../../.services/progress_notes/models/progress_notes_response';
import { DatePipe } from '@angular/common';
import { SafeHtmlPipePipe } from '../../../../.pipes/safe-html-pipe-pipe';

@Component({
  selector: 'app-notes-card',
  imports: [DatePipe, SafeHtmlPipePipe],
  templateUrl: './notes-card.html',
  styleUrl: './notes-card.css',
})
export class NotesCard {
// @Input({ required: true }) note!: ProgressNotesResponse;
note = input.required<ProgressNotesResponse>();
}
