import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from './auth.service';

import Toastify from 'toastify-js'
import "toastify-js/src/toastify.css"

export const authGuardAny: CanActivateFn = (route, state) => {

  
   const authService = inject(AuthService);
   const loginState = authService.isLoginSubject.getValue();
   if (loginState.state) {
     return true;
   } else{
    Toastify({
      text: "You are not authorized to access this route",
      duration: 3000,
      position: "center"
    }).showToast();
    
    return false;

   }
   
};
