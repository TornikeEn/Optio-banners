import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { getBannersListPayload, referenceDataPayload, removeBannerImagePayload, removeBannerPayload, saveBannerPayload } from '../model/export-models';

@Injectable({
  providedIn: 'root',
})

export class BannersApiService {
  constructor(private _http: HttpClient) {}

  getBannersList(payload: getBannersListPayload | undefined): Observable<any> {
    return this._http.post('banners/find', payload);
  }
  
  saveBanner(payload: saveBannerPayload): Observable<any> {
    return this._http.post('banners/save', payload);
  }

  removeBanner(payload: removeBannerPayload): Observable<any> {
    return this._http.post('banners/remove', payload);
  }
  
  getReferenceData(payload: referenceDataPayload): Observable<any> {
    return this._http.post('reference-data/find', payload);
  }

  uploadBannerImage(payload: Blob): Observable<any> {
    const formData = new FormData();
    formData.set('blob', payload);
    return this._http.post('blob/upload', formData);
  }

  removeBannerImage(payload: removeBannerImagePayload): Observable<any> {
    return this._http.post('blob/remove', payload);
  }
}
