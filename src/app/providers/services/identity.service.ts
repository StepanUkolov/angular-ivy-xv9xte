import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {
  catchError,
  finalize,
  mergeMap as _observableMergeMap,
  tap,
} from "rxjs/operators";

import jwt_decode from "jwt-decode";
import {Router} from "@angular/router";
import {SignInModel} from "../../core/models/sign-in.model";
import {Observable, of, throwError} from "rxjs";
import {AbstractControl, ValidationErrors} from "@angular/forms";
import { IdentityClient } from "../../web-api-client";

@Injectable({
  providedIn: "root",
})
export class IdentityService {
  private readonly url = "api/Identity";
  loading: boolean = false;
  
  private refreshTokenTimeout;
  constructor(private http: HttpClient, private router: Router, private identityClient: IdentityClient) {
  }


  public startRefreshTokenTimer() {
    //console.log(`Start timer ${(new Date(Date.now())).toISOString()}`);
    const exp = this.decodeToken()['exp']

    const expires = new Date(exp * 1000);
    const timeout = expires.getTime() - Date.now() - (60 * 1000);
    this.refreshTokenTimeout = setTimeout(() => {

      this.refreshTokens();

      //console.log(`${(new Date(Date.now())).toISOString()}`);
    }, timeout);
  }

  private stopRefreshTokenTimer() {
    clearTimeout(this.refreshTokenTimeout);
  }
  refreshTokens() {

    return this.identityClient.renewTokens()
      .subscribe(res => {
        //console.log(res);
        this.setAccessToken(res)
      })

  }


  get isActive() {
    this.decodeToken();
    return !(this.accessToken == null || this.accessToken == undefined || this.accessToken == "");
  }

  signIn(model: SignInModel) {
    this.loading = true;
    return this.http.post(this.url + "/SignIn", model).pipe(
      tap(response => {
        return response;
      }),
      catchError((error) => {
        this.loading = false;
        return throwError(error);
      })
    );
  }

  signOut(userId: string) {
    if (userId) {
    this.loading = true;
    this.stopRefreshTokenTimer()

    return this.identityClient.signOut(userId).pipe(
        catchError((error) => {
          this.loading = false;
          return throwError(error);
        })
      );
    }

    //return this.http.get(this.url + `/SignOut`).pipe(
    //  catchError((error) => {
    //    this.loading = false;
    //    return throwError(error);
    //  })
    //);
  }


  //renewTokens(userId: string) {
  //  return this.http.get(this.url + `/RenewTokens`).pipe(
  //    catchError((error) => {
  //      return throwError(error);
  //    })
  //  );
  //}



  getRoles(userId: string) : any {
    return this.http.get(this.url + `/${userId}/GetRoles`).pipe(
      catchError((error) => {
        return throwError(error);
      })
    );
  }

  ///////////////

  setAccessToken(token: string) {
    
    localStorage.setItem("AccessToken", token);
    this.startRefreshTokenTimer() 
  }

  get isRememberMe() {
    return !!localStorage.getItem("RememberMe");
  }

  get userId() {
    return this.decodeToken()["userId"] ?? "";
  }

  get userName() {
    return this.decodeToken()["userName"] ?? "";
  }

  get accessToken() {
      return localStorage.getItem("AccessToken");
  }

  isAccessTokenExpired() {
    return Date.now() >= this.decodeToken()["exp"] * 1000;
  }

  isAccessTokenValid() {
    return this.decodeToken() && this.decodeToken()["iss"] == "SecretUser";
  }

  navigateToLoginPage() {
    this.router.navigate(["/Identity/SignIn"]);
  }

  navigateToUnauthorizedPage() {
    this.router.navigate(["/Unauthorized"]);
  }

  navigateToAccountPage() {
    this.router.navigate(["/Identity/Account"]);
  }

  clearStorage() {
    localStorage.clear();
    sessionStorage.clear();
  }

  public removeSession() {
    localStorage.clear();
    sessionStorage.clear();
  }

  goToLogin() {
    this.removeSession();
    this.router.navigate(['/authentication/login']);
  }
  isInRole(role: string) {
    let roles: string[] = this.decodeToken()["role"] ?? [];
    if (typeof roles === "string") {
      roles = [roles];
    }
    return roles.map((x) => x.toLowerCase()).includes(role.toLowerCase());
  }

  decodeToken() {
    try {
      return jwt_decode<{}>(this.accessToken);
    } catch {
      this.removeSession();
      return {}
    }
  }


}
