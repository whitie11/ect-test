import { Component, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-not-built',
  imports: [],
  templateUrl: './page-not-built.html',
  styleUrl: './page-not-built.css',
})
export class PageNotBuilt {
pageName: string = '';

constructor(private activeRoute: ActivatedRoute) {
  this.pageName = this.activeRoute.snapshot.data['pageName'] || '';
}
}
