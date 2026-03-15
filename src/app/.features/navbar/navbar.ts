import { Component, HostListener, inject } from '@angular/core';
import { AsyncPipe, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TokenStorageService } from '../../.services/token/token-storage.service';
import { AuthService } from '../../.services/auth/auth.service';
import { BehaviorSubject } from 'rxjs';
import { IsLoggedIn } from '../../.models/is-logged-in';
import { CdkPortal, ComponentPortal, PortalModule } from '@angular/cdk/portal';
import { Overlay, CdkOverlayOrigin, CdkConnectedOverlay, OverlayRef } from '@angular/cdk/overlay';
import { ReferralMenu } from './components/referral-menu/referral-menu';
import { ClinicMenu } from './components/clinic-menu/clinic-menu';


@Component({
  selector: 'app-navbar',
  imports: [AsyncPipe, RouterLink, NgClass],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private router = inject(Router);
  private tokenStorageService = inject(TokenStorageService);
  private authService = inject(AuthService);

  isMenuOpen = false;
  isLoggedIn$ = this.authService.isLoginSubject.asObservable();

  private overlayRef: OverlayRef | null = null;
  private overlayClinic: OverlayRef | null = null;

  constructor(
    private overlay: Overlay,
    private overlayC: Overlay

  ) {
    this.isLoggedIn$ = this.authService.isLoginSubject.asObservable();
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }


  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const clickedInside = target.closest('#mobile-menu') || target.closest('button[command="--toggle"]');
    if (!clickedInside) {
      this.isMenuOpen = false;
    }
  }

  logout() {
    this.authService.logout();
  }

  login() {
    this.router.navigate(['/login']);
  }

    showClinicMenu() {
    // const target = document.getElementById('changeStageButton');
    const targetC = document.querySelector("#clinic-link") as HTMLElement;
    this.overlayClinic = this.overlayC.create({
      hasBackdrop: true,
      backdropClass: "",
      panelClass: "mat-elevation-z8",
      positionStrategy: this.overlayC
        .position()
        .flexibleConnectedTo(targetC)
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top"
          }
        ])
    });
    const component = new ComponentPortal(ClinicMenu);
    const componentRef = this.overlayClinic.attach(component);
    componentRef.instance.closeMenu.subscribe(() => {
      this.closeClinicMenu();
    });
    this.overlayClinic?.backdropClick().subscribe(() => this.overlayClinic?.detach());
  }

  closeClinicMenu() {
  this.overlayClinic?.detach();
}

  showRefMenu() {
    // const target = document.getElementById('changeStageButton');
    const target = document.querySelector("#referral-link") as HTMLElement;
    this.overlayRef = this.overlay.create({
      
      hasBackdrop: true,
      backdropClass: "",
      panelClass: "mat-elevation-z8",
      positionStrategy: this.overlay
        .position()
        .flexibleConnectedTo(target)
        .withPositions([
          {
            originX: "start",
            originY: "bottom",
            overlayX: "start",
            overlayY: "top"
          }
        ])
    });
    const component = new ComponentPortal(ReferralMenu);
    const componentRef = this.overlayRef.attach(component);
    componentRef.instance.closeMenu.subscribe(() => {
      this.closeRefMenu();
    });
    this.overlayRef?.backdropClick().subscribe(() => this.overlayRef?.detach());
  }

  closeRefMenu() {
  this.overlayRef?.detach();
}



}
