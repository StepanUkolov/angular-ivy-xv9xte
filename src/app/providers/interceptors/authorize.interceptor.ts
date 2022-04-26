import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { catchError, filter, switchMap, take } from "rxjs/operators";
import { IdentityClient } from "../../web-api-client";
import { IdentityService } from "../services/identity.service";

@Injectable()
export class AuthorizeInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private identityClient: IdentityClient,
    private authorizeService: IdentityService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const token = this.authorizeService.accessToken;

    request = this.addTokenToHeader(request, token);

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {


        if (error?.url.toString().includes("/RenewTokens")) {
          this.authorizeService.removeSession();
          this.authorizeService.goToLogin();
          return throwError(error);
        }

        if (error.status === 401) {
         // return this.handle401Error(request, next);
        }

        return throwError(error);
      })
    );
  }

  //private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
  //  if (!this.isRefreshing) {
  //    this.isRefreshing = true;

  //    return this.identityClient.renewTokens().pipe(
  //      switchMap((response: any) => {
  //        this.isRefreshing = false;


  //        this.authorizeService.setAccessToken(
  //          response.,
  //        );

  //        return next.handle(
  //          this.addTokenToHeader(request, response.accessToken)
  //        );
  //      }),
  //      catchError((err) => {

  //        this.isRefreshing = false;

  //        return throwError(err);
  //      })
  //    );
  //  }
  //}

  private addTokenToHeader(request: HttpRequest<any>, token: string) {

    return request.clone({
      headers: request.headers.set("Authorization", "Bearer " + token),
    });
  }
}
