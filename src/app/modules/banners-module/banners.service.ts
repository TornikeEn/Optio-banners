import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class BannersService {
    bannerDetails$ = new Subject<any>();
    updateBannersList$ = new BehaviorSubject<boolean>(true)
}
