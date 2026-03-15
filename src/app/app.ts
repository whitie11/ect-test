import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./.features/login/login";
import { AboutComponent } from "./.features/about.component/about.component";
import { Error } from "./.features/error/error";
import { Navbar } from './.features/navbar/navbar';


@Component({
  selector: 'app-root',
  imports: [ RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  // protected readonly title = signal('ect-test');
}
