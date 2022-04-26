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
import { IdentityClient } from "../../../app/web-api-client";
import { IdentityService } from "../services/identity.service";

@Injectable({ providedIn: "root" })
export class RoleGuard implements CanActivate {
  constructor(
    private router: Router,
    private identityService: IdentityService,
    private identityClient: IdentityClient
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var roles: string[] = route.data.roles || [];

    for (let role of roles) {
      console.log(role);

      if (this.identityService.isInRole(role)) {
        return true;
      }
    }

    return false;
  }
}
