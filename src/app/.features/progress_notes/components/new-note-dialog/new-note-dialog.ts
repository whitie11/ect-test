import { Component, EventEmitter, input, OnDestroy, OnInit, Output, signal } from '@angular/core';
import { NgxEditorComponent, NgxEditorMenuComponent, Editor, Toolbar } from 'ngx-editor';
import { AbstractControl, FormControl, FormGroup, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-note-dialog',
  imports: [FormsModule, NgxEditorComponent, NgxEditorMenuComponent],
  templateUrl: './new-note-dialog.html',
  styleUrl: './new-note-dialog.css',
})
export class NewNoteDialog implements OnInit, OnDestroy {
  @Output() closeDialog = new EventEmitter();
  @Output() saveNewNote = new EventEmitter<string>(); 
  
  selectedReferralId = signal<number>(0);
  editor =  new Editor();
  html = 'Try this!';
  editordoc = ''

   toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    [ 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

ngOnInit(): void {
 this.editor = new Editor();
}

doCloseDialog() {
  console.log('Closing dialog');
  this.closeDialog.emit();
}

saveNote(note: string) {
  console.log('Saving new note:', note);
  this.saveNewNote.emit(note);
  this.closeDialog.emit();
} 

ngOnDestroy(): void {
  this.editor.destroy();
}
}
