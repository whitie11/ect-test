import { Component, EventEmitter, Output } from '@angular/core';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-referral-menu',
  imports: [RouterLink],
  templateUrl: './referral-menu.html',
  styleUrl: './referral-menu.css',
})
export class ReferralMenu {
  @Output() closeMenu = new EventEmitter();

  doCloseMenu() {  // Logic to close the dialog
  this.closeMenu.emit();
}
}
