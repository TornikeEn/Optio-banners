import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { BannersFindDto, BannerRemoveDto, BannersSaveDto, BannersFindOneDto } from '../types';

@Injectable({
  providedIn: 'root',
})

export class BannersApiService {
  constructor(private _http: HttpClient) {}

  find(payload: BannersFindDto | undefined): Observable<any> {
    return this._http.post('banners/find', payload);
  }

  findOne(payload: BannersFindOneDto | undefined): Observable<any> {
    return this._http.post('banners/find-one', payload);
  }
  
  save(payload: BannersSaveDto): Observable<any> {
    return this._http.post('banners/save', payload);
  }

  remove(payload: BannerRemoveDto): Observable<any> {
    return this._http.post('banners/remove', payload);
  }

}
