import { Injectable } from '@angular/core';
import { IdentityService } from './providers/services/identity.service';

@Injectable()
export class AppInitService {

  constructor(public authorizeService: IdentityService) {
  }

  Init() {

    return new Promise<void>((resolve, reject) => {

      if (this.authorizeService.isActive) {
        this.authorizeService.refreshTokens();
        resolve();
      }

      resolve();
      

    });
  }


}
