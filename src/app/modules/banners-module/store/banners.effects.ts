import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY, catchError, exhaustMap, map, of } from 'rxjs';
import * as bannersActions from './banners.actions';
import * as bannersApiActions from './banners-api.actions';
import { BannersApiService } from 'src/app/shared/httpClient/api/banners-api.service';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage.service';

@Injectable()
export class BannersEffects {
  
  loadBannersList$ = createEffect(() =>
    this.actions$.pipe(
      ofType(bannersActions.getBannersList),
      exhaustMap(({payload, blobPath}) => {
        let payloadForApi = payload;
        if(payload) {
          this._sessionStorageService.set('bannersListFilterParams', payload);
        } else {
          const savedFilterParams = this._sessionStorageService.get('bannersListFilterParams');
          payloadForApi = savedFilterParams;
        }
        return this._bannersApiService.getBannersList(payloadForApi).pipe(
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
      ofType(bannersActions.removeBanner),
      exhaustMap(({payload, blobPath}) => {
        return this._bannersApiService.removeBanner(payload).pipe(
          map((res) => {
            // return bannersApiActions.bannerRemoveSuccess({blobPath});
            return bannersApiActions.bannerRemoveSuccess({id: payload.id!});
          }),
          catchError((res) => {
            return of(bannersApiActions.bannerRemoveFail());
          })
        )}
      )
    )
  );

  // removeAfterBanner$ = createEffect(() =>
  //   this.actions$.pipe(
  //     ofType(bannersApiActions.bannerRemoveSuccess),
  //     exhaustMap(({blobPath}) => {
  //       const savedFilterParams = this._sessionStorageService.get('bannersListFilterParams');
  //       return this._bannersApiService.getBannersList(savedFilterParams).pipe(
  //         map((res) => {
  //           return bannersApiActions.bannersApiFindSuccess({ data: res.data, blobPath: blobPath});
  //         }),
  //         catchError((res) => {
  //           return of(bannersApiActions.bannersApiFindFail());
  //         })
  //       )}
  //     )
  //   )
  // );

  getReferenceData$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.getReferenceData),
    exhaustMap(({payload}) => {
      return this._bannersApiService.getReferenceData(payload).pipe(
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

 removeBannerImage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.removeBannerImage),
    exhaustMap(({payload}) => {
      return this._bannersApiService.removeBannerImage(payload).pipe(
        map((res) => {
          return bannersApiActions.removeBannerImageApiSuccess({ response: res });
        }),
        catchError((res) => {
          return EMPTY;
        })
      )}
    )
  )
);

 saveBanner$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.saveBanner),
    exhaustMap(({payload}) => {
      console.log(payload)
      return this._bannersApiService.saveBanner(payload).pipe(
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

 uploadBannerImage$ = createEffect(() =>
  this.actions$.pipe(
    ofType(bannersActions.uploadBannerImage),
    exhaustMap(({payload}) => {
      return this._bannersApiService.uploadBannerImage(payload).pipe(
        map((res) => {
          return bannersApiActions.uploadBannerImageApiSuccess({ response: res });
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
    private _sessionStorageService: SessionStorageService
  ) {}
}
