import { Component, EventEmitter, model, Output, signal } from '@angular/core';
import { Stage as StageEnum } from '../../../.enums/stage';  
import { EnumKeyValuePipe } from '../../../.pipe/enumPipe';

@Component({
  selector: 'app-change-stage-dialog',
  imports: [EnumKeyValuePipe],
  templateUrl: './change-stage-dialog.html',
  styleUrl: './change-stage-dialog.css',
})
export class ChangeStageDialog {
@Output() closeDialog = new EventEmitter();
@Output() saveChanges = new EventEmitter<{ newStage: string; notes: string }>();

Stage = StageEnum;

currentStage = signal('');
newStage = model('');

changeStage(newStage: any) {
  // this.newStage.set(newStage);   
}

getextBoxVal(txt: any) {
  console.log('Text box value:', txt.value);
}

doCloseDialog() {  // Logic to close the dialog
  console.log('Dialog closed');
  this.closeDialog.emit();
}

saveNewChanges(newStage: string, notes: string) {
  console.log('Saving changes with new stage:');
  this.saveChanges.emit({ newStage, notes});
  this.closeDialog.emit();
}
}