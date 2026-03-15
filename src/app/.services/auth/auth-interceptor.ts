import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { TokenStorageService } from '../token/token-storage.service';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from './auth.service';


let isAuthenticating = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenStorageService);
  const authService = inject(AuthService);

  const token = tokenService.getAccessToken();
  if (token && !isAuthenticating) {
    const cloned = req.clone({
      headers: req.headers.set(
        'Authorization', 'Bearer '.concat(token)
      ),
    });
    console.log('In interceptor with access token');
    return next(cloned).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          console.log('trying to refresh token ');
          const refreshToken = tokenService.getRefreshToken();
          if (refreshToken) {
            //     // get new access token
            isAuthenticating = true;
            return authService.getRefreshedAccessToken(refreshToken).pipe(
              switchMap((data: any) => {
                console.log(' new access token = ' + data.accessToken);

                const newReq = req.clone({
                  headers: req.headers.set(
                    'Authorization',
                    'Bearer '.concat(data.accessToken)
                  ),
                });

                isAuthenticating = false;
                return next(newReq);
              }),
              catchError((err) => {
                console.log(' could not refresh token = ' + err.message);
                // TODO Show dialog Refresh token has expired!
                authService.logout();
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
    return next(req); // no token was available, continue without
  }
}




