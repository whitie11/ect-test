import { Injectable} from '@angular/core';
import { IsLoggedIn } from '../../.models/is-logged-in';
import { BehaviorSubject, shareReplay, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { TokenStorageService } from '../token/token-storage.service';
import { Router} from '@angular/router';
import { environment } from '../../../environments/environment';
import { JWTPayload } from '../../.models/JWTPayload';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '../../.models/auth-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService   {
  loggedOutState: IsLoggedIn = {
    state: false,
    username: 'Please Login',
    userID: 0,
    role: '',
  };

  isLoginSubject = new BehaviorSubject<IsLoggedIn>(this.loggedOutState);

  constructor(
    private http: HttpClient,
    private tokenService: TokenStorageService,
    private router: Router,
    
  ) { 
    console.log("AuthService Constructor called " +this.isLoginSubject.getValue().username); 
  if (this.tokenService.getAccessToken()) {
    const payload = <JWTPayload>jwtDecode(this.tokenService.getAccessToken() ?? '');
    const loginState: IsLoggedIn = {
      state: true,
      username: payload.username,
      userID: Number(payload.user_id),
      role: payload.role
    };
    this.isLoginSubject.next(loginState);
  } else {
    this.isLoginSubject.next(this.loggedOutState);
  }
  } 

  x = 1 
  apiRoot = environment.apiRoot;

  login(name: string, password: string) {
    console.log("AuthService login called" + this.x);
    return this.http
      .post<AuthResponse>(this.apiRoot.concat('auth/login'), { name, password })
      .pipe(
        tap((response) => {
          this.setLoginState(name, response);
        }),
        shareReplay()
      );
  }

  isLoggedIn() {
    return this.isLoginSubject.getValue().state;
  }

  setLoginState(name: string, res: AuthResponse) {
    // const userID = payload.user_id;
    const payload = <JWTPayload>jwtDecode(res.accessToken);
    const newloginState: IsLoggedIn = {
      state: true,
      username: payload.username,
      userID: Number(payload.user_id),
      role: payload.role
    };
    this.isLoginSubject.next(newloginState);
    this.tokenService.saveTokens(res);
  }

  logout() {
    this.tokenService.signOut();
    this.isLoginSubject.next(this.loggedOutState);
   this.router.navigate([''], { replaceUrl: true });
  }

   getRefreshedAccessToken(refreshToken: any) {
    return this.http
      .post(this.apiRoot.concat('auth/refreshToken'), {
        refreshToken: refreshToken,
      })
      .pipe(
        tap((response) => {
          this.tokenService.saveRefreshedAccessToken(response);
          return response;
        }),
        shareReplay()
      );
  }

}
