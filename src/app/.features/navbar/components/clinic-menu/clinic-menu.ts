import { Component, EventEmitter, Input, input, Output } from '@angular/core';
import { RouterLink } from "@angular/router";
import {ClinicIdEnum} from '../../../../.enums/clinicIdEnum'

@Component({
  selector: 'app-clinic-menu',
  imports: [RouterLink],
  templateUrl: './clinic-menu.html',
  styleUrl: './clinic-menu.css',
})
export class ClinicMenu {
@Output() closeMenu = new EventEmitter();

clinicIdEnum = ClinicIdEnum 

  doCloseMenu() {  // Logic to close the dialog
  this.closeMenu.emit();
}
}
