import { createAction, props } from '@ngrx/store';
import { BannersFindDto, referenceDataFindDto, blobRemoveDto, BannerRemoveDto, BannersSaveDto } from 'src/libs/web/banners/src/lib/store/types';

export const queryParamsChanged = createAction(
  '[Banners List Page Component] query parameters changed',
  props<{payload: BannersFindDto}>()
);

export const removeBannerRequest = createAction(
  '[Banners List Page Component] remove banner requested',
  props<{payload: BannerRemoveDto}>()
);

export const editBannerRequest = createAction(
  '[Banners List Page Component] edit banner requested',
  props<{bannerId: string}>()
);

export const referenceDataFindRequest = createAction(
  '[Banners List Page Component] reference data find requested',
  props<{payload: referenceDataFindDto}>()
);

export const removeBannerImageRequest = createAction(
  '[Banners List Page Component] remove banner image requested',
  props<{payload: blobRemoveDto}>()
);

export const saveBannerRequest = createAction(
  '[Banners List Page Component] save banner requested',
  props<{payload: BannersSaveDto}>()
);

export const uploadBannerImageRequest = createAction(
  '[Banners List Page Component] upload banner image requested',
  props<{payload: Blob}>()
);

export const routerNavigateRequested = createAction(
  '[Banners List Page Component] router navigate requested',
  props<{queryParams: any}>()
);