import { Component, EventEmitter, model, Output, signal } from '@angular/core';
import { StageEnum } from '../../../.enums/stage';
import { Editor, NgxEditorComponent, NgxEditorMenuComponent, Toolbar } from 'ngx-editor';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-change-stage-dialog',
  imports: [FormsModule, NgxEditorComponent, NgxEditorMenuComponent],
  templateUrl: './change-stage-dialog.html',
  styleUrl: './change-stage-dialog.css',
})
export class ChangeStageDialog {
  @Output() closeDialog = new EventEmitter();
  @Output() saveChanges = new EventEmitter<{ newStage: StageEnum; notes: string }>();

  Stage = Object.values(StageEnum); // Get enum values for template iteration


  currentStage = signal<StageEnum>(StageEnum.UNKNOWN);
  newStage = model<StageEnum>(StageEnum.UNKNOWN);
  newStageStr = ''
  changeStage(newStage: StageEnum) {
    this.newStage.set(newStage);
  }

  editor = new Editor();
  editordoc = ''

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];


  getextBoxVal(txt: any) {
    console.log('Text box value:', txt.value);
  }

  doCloseDialog() {  // Logic to close the dialog
    console.log('Dialog closed');
    this.closeDialog.emit();
  }

  saveNewChanges(notes: string) {
    console.log('Saving changes with new stage:');
    // Use the new stage set by changeStage method
    this.saveChanges.emit({ newStage: this.newStage(), notes });
    this.closeDialog.emit();
  }
}