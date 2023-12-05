import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class SessionStorageService {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
  }

  set(property: string, value: any): void {
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(property, JSON.stringify(value));
    }
  }

  get(property: string): any {
    if (isPlatformBrowser(this.platformId)) {
      if (sessionStorage.getItem(property)) {
        return JSON.parse(sessionStorage.getItem(property)!);
      }
    }
  }
}
