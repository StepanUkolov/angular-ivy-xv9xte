import { Component, OnInit } from "@angular/core";
import { IdentityService } from "../../../../app/providers/services/identity.service";
import { Observable } from "rxjs";
import { IdentityClient } from "../../../web-api-client";

@Component({
  selector: "app-account",
  templateUrl: "./account.component.html",
  styleUrls: ["./account.component.scss"],
})
export class AccountComponent implements OnInit {
  userRoles: Observable<string[]>;

  constructor(
    private identityService: IdentityService
  ) {}

  ngOnInit(): void {
    this.userRoles = this.identityService.getRoles(this.identityService.userId);
  }
}
