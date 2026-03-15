import { Component, inject, OnInit } from '@angular/core';
import { Login } from "../login/login";
import { AboutComponent } from "../about.component/about.component";
import {Error} from "../error/error";
import { Navbar } from "../navbar/navbar";
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../.services/auth/auth.service';


@Component({
  selector: 'app-home',
  imports: [Navbar, RouterOutlet],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private authService = inject(AuthService);
  private router= inject(Router);

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      console.log('User is logged in');
    } else {
      console.log('User is not logged in');
       this.router.navigate(['/login'], { replaceUrl: true });
    }
    console.log("Home component initialized");
  }

}
