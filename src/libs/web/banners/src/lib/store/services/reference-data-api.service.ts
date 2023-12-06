import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { blobRemoveDto, referenceDataFindDto } from '../types';

@Injectable({
  providedIn: 'root',
})

export class ReferenceDataApiService {
  constructor(private _http: HttpClient) {}
  
  find(payload: referenceDataFindDto): Observable<any> {
    return this._http.post('reference-data/find', payload);
  }

  upload(payload: Blob): Observable<any> {
    const formData = new FormData();
    formData.set('blob', payload);
    return this._http.post('blob/upload', formData);
  }

  remove(payload: blobRemoveDto): Observable<any> {
    return this._http.post('blob/remove', payload);
  }
}
