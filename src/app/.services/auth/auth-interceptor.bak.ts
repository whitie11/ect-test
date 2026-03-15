import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TokenStorageService } from '../token/token-storage.service';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, Observable, switchMap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor2 implements HttpInterceptor{
   isAuthenticating = false;
  
  private tokenService = inject(TokenStorageService);
  public authService = inject(AuthService);
  public router = inject(Router);


  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const token = this.tokenService.getAccessToken();
    if (token && !this.isAuthenticating) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', 'Bearer '.concat(token)),
      });
      console.log('In interceptor with access token');
      return next.handle(cloned).pipe(
        catchError((err: HttpErrorResponse) => {
          if (err.status == 401) {
            console.log('trying to refresh token ');
            const refreshToken = this.tokenService.getRefreshToken();
            if (refreshToken) {
              //     // get new access token
              this.isAuthenticating = true;
              return this.authService.getRefreshedAccessToken(refreshToken).pipe(
                switchMap((data: any) => {
                  console.log(' new access token = ' + data.access);

                  const newReq = req.clone({
                    headers: req.headers.set(
                      'Authorization',
                      'Bearer '.concat(data.access)
                    ),
                  });

                  this.isAuthenticating = false;
                  return next.handle(newReq);
                }),
                catchError((err) => {
                  console.log(' could not refresh token = ' + err.message);
                  // TODO Show dialog Refresh token has expired!
                  this.authService.logout();
                  return throwError(() => err);
                })
              );
            } else {
              return throwError(() => err); // no refresh token available
            }
          } else {
            return throwError(() => err); // error not 401
          }
        })
      );
    } else {
      return next.handle(req); // no token was available, continue without
    }
  }

  handle401Error(error: HttpErrorResponse) {
    this.router.navigate(['/login']);
    return throwError(() => error);
  }
}
