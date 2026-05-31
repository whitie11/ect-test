import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { JWTPayload } from '../../.models/jwtpayload';
import { DateTime } from 'luxon';
import { AuthResponse } from '../../.models/auth-response';




const ACCESS_TOKEN_KEY = 'access-token';
const REFRESH_TOKEN_KEY = 'refresh-token';
const USER_KEY = 'auth-user';
const USER_ROLE = 'auth-user-role';
const USER_ID_KEY = 'auth-user-id';
const EXPIRES_AT = 'expires-at';



@Injectable({
  providedIn: 'root',
})
export class TokenStorageService {
  signOut(): void {
    window.sessionStorage.clear();
  }

  public saveTokens(token: AuthResponse): void {
    const payload = <JWTPayload>jwtDecode(token.accessToken);
    const expiresAt = DateTime.fromSeconds(payload.exp)
    const expiresAtISO = expiresAt.toISO() ?? '';

    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    window.sessionStorage.removeItem(EXPIRES_AT);
    window.sessionStorage.removeItem(USER_ID_KEY);
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.removeItem(USER_ROLE);

    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken);
    window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
    window.sessionStorage.setItem(EXPIRES_AT, expiresAtISO );
    window.sessionStorage.setItem(USER_ID_KEY, payload.user_id.toString());
    window.sessionStorage.setItem(USER_KEY, payload.username);
    window.sessionStorage.setItem(USER_ROLE, payload.role);
  }

  public saveRefreshedAccessToken(token: any) {
    const accessToken = token.accessToken;
    const payload = <JWTPayload>jwtDecode(accessToken);
    const expiresAt = DateTime.fromSeconds(payload.exp)
    const expiresAtISO = expiresAt.toISO() ?? '';

    window.sessionStorage.removeItem(ACCESS_TOKEN_KEY);
    window.sessionStorage.removeItem(EXPIRES_AT);
     window.sessionStorage.removeItem(REFRESH_TOKEN_KEY);

    window.sessionStorage.setItem(ACCESS_TOKEN_KEY, token.accessToken);
    window.sessionStorage.setItem(EXPIRES_AT, expiresAtISO )
     window.sessionStorage.setItem(REFRESH_TOKEN_KEY, token.refreshToken);
  }

  public getAccessToken(): string | null {
    return window.sessionStorage.getItem(ACCESS_TOKEN_KEY);
    // this.auth.refreshToken();
  }

  public getRefreshToken(): string | null {
    return window.sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  // public saveUser(user: string): void {
  //   window.sessionStorage.removeItem(USER_KEY);
  //   window.sessionStorage.setItem(USER_KEY, user);
  // }

  // public getUser(): string {
  //   if (window.sessionStorage.getItem(USER_KEY)) {
  //     return window.sessionStorage.getItem(USER_KEY)!;
  //   } else return '';
  // }

  // public getUserID(): number {
  //   if (window.sessionStorage.getItem(USER_ID_KEY)) {
  //     return parseInt(window.sessionStorage.getItem(USER_ID_KEY)!, 10);
  //   }
  //   else return 0;
  // }

  // public saveUserRole(userRole: string): void {
  //   window.sessionStorage.removeItem(USER_ROLE);
  //   window.sessionStorage.setItem(USER_ROLE, userRole);
  // }

  // public getUserRole(): string {
  //   if (window.sessionStorage.getItem(USER_ROLE)) {
  //     return window.sessionStorage.getItem(USER_ROLE)!;
  //   } else return '';
  // }


}


