import { Component, EventEmitter, model, Output, signal } from '@angular/core';
import { StageEnum } from '../../../.enums/stage';  
import { EnumKeyValuePipe } from '../../../.pipe/enumPipe';

@Component({
  selector: 'app-change-stage-dialog',
  imports: [EnumKeyValuePipe],
  templateUrl: './change-stage-dialog.html',
  styleUrl: './change-stage-dialog.css',
})
export class ChangeStageDialog {
@Output() closeDialog = new EventEmitter();
@Output() saveChanges = new EventEmitter<{ newStageStr: string; notes: string }>();

Stage = StageEnum;

currentStage = signal('');
newStage = model('');
newStageStr =''
changeStage(newStage: any) {
  //  this.newStage.set(newStage); 
  this.newStageStr = newStage.key; // Assuming stage has a 'key' property  
}

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
  this.saveChanges.emit({ newStageStr: this.newStageStr, notes });
  this.closeDialog.emit();
}
}