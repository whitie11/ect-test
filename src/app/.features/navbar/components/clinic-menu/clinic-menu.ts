import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-clinic-menu',
  imports: [],
  templateUrl: './clinic-menu.html',
  styleUrl: './clinic-menu.css',
})
export class ClinicMenu {
@Output() closeMenu = new EventEmitter();

  doCloseMenu() {  // Logic to close the dialog
  this.closeMenu.emit();
}
}
