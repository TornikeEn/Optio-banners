import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, map, mergeMap, of, switchMap, tap } from 'rxjs';
import * as bannersActions from '../actions/banners-list-page.actions';
import * as bannersApiActions from '../actions/banners-api.actions';
import { BannersApiService } from '../services/banners-api.service';
import { ReferenceDataApiService } from '../services/reference-data-api.service';

@Injectable()
export class BannersEffects {
  
  findBanners$ = createEffect(() =>
    this.actions$.pipe(
      ofType(bannersActions.queryParamsChanged),
      switchMap(({payload, blobPath}) => {
        return this._bannersApiService.find(payload).pipe(
          map((res) => {
            return bannersApiActions.bannersApiFindSuccess({ data: res.data, blobPath });
          }),
          catchError((res) => {
            return of(bannersApiActions.bannersApiFindFail());
          })
        )}
      )
    )
  );

  removeBanner$ = createEffect(() =>
    this.actions$.pipe(
      ofType(bannersActions.removeBannerRequest),
      mergeMap(({payload}) => {
        return this._bannersApiService.remove(payload).pipe(
          map((res) => {
            return bannersApiActions.bannerApiRemoveSuccess({id: payload.id!});
          }),
          catchError((res) => {
            return of(bannersApiActions.bannerApiRemoveFail());
          })
        )}
      )
      ,tap((a) => {
        console.log(a)
      })
    )
  );

  saveBanner$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.saveBannerRequest),
    mergeMap(({payload}) => {
      return this._bannersApiService.save(payload).pipe(
        map((res) => {
          return bannersApiActions.saveBannerApiSuccess({ response: res });
        }),
        catchError((res) => {
          return EMPTY;
        })
      )}
    )
  )
);

  referenceDataFind$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.referenceDataFindRequest),
    switchMap(({payload}) => {
      return this._referenceDataApiService.find(payload).pipe(
        map((res) => {
          return bannersApiActions.referenceDataApiFindSuccess({ refData: res.data });
        }),
        catchError((res) => {
          return EMPTY;
        })
      )}
    )
  )
);

 removeBlob$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.removeBannerImageRequest),
    mergeMap(({payload}) => {
      return this._referenceDataApiService.remove(payload).pipe(
        map((res) => {
          return bannersApiActions.removeBlobApiSuccess({ response: res });
        }),
        catchError((res) => {
          return EMPTY;
        })
      )}
    )
  )
);

 uploadBlob$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.uploadBannerImageRequest),
    switchMap(({payload}) => {
      return this._referenceDataApiService.upload(payload).pipe(
        map((res) => {
          return bannersApiActions.uploadBlobApiSuccess({ response: res });
        }),
        catchError((res) => {
          return EMPTY;
        })
      )}
    )
  )
);

  constructor(
    private actions$: Actions,
    private _bannersApiService: BannersApiService,
    private _referenceDataApiService: ReferenceDataApiService,
  ) {}
}
