import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
  CanDeactivate,
  CanActivateChild,
  CanLoad,
  Route,
  UrlSegment,
} from "@angular/router";
import { BehaviorSubject, empty, Observable } from "rxjs";
import { IdentityClient } from "src/app/web-api-client";
import { IdentityService } from "../services/identity.service";

@Injectable({ providedIn: "root" })
export class AuthorizeGuard implements CanActivate {
  constructor(
    private router: Router,
    private identityService: IdentityService,
    private identityClient: IdentityClient
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (
      this.identityService.accessToken &&
      this.identityService.isAccessTokenValid()
    )
      return true;

    this.identityService.navigateToLoginPage();
    return false;
  }
}
