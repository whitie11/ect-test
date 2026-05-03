import { Component, inject, Input, input } from '@angular/core';
import { Appointment } from '../../../../.models/appointment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-diary-card',
  imports: [],
  templateUrl: './diary-card.html',
  styleUrl: './diary-card.css',
})
export class DiaryCard {
  private router = inject(Router);
@Input()
appt: Appointment| null = null;

doTreatment(appt: Number) {
  this.router.navigate(['home/treatment/'+ appt]); 
}
}
