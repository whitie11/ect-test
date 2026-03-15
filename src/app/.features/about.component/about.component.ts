import { Component, OnInit } from '@angular/core';
import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

@Component({
  selector: 'app-about.component',
  imports: [],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent implements OnInit {

  ngOnInit(): void {
    // Toastify({
    //   text: "This is a toast",
    //   duration: 3000
    // }).showToast();
  }

}
