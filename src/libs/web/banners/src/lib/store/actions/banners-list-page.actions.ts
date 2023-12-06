import { createAction, props } from '@ngrx/store';
import { BannersFindDto, referenceDataFindDto, blobRemoveDto, BannerRemoveDto, BannersSaveDto } from 'src/libs/web/banners/src/lib/store/types';

export const queryParamsChanged = createAction(
  '[Drawer Component] query parameters changed',
  props<{payload: BannersFindDto, blobPath: string}>()
);

export const removeBannerRequest = createAction(
  '[Drawer Component] remove banner requested',
  props<{payload: BannerRemoveDto}>()
);

export const editBannerRequest = createAction(
  '[Drawer Component] edit banner requested',
  props<{bannerDetails: any}>()
);

export const referenceDataFindRequest = createAction(
  '[Drawer Component] reference data find requested',
  props<{payload: referenceDataFindDto}>()
);

export const removeBannerImageRequest = createAction(
  '[Drawer Component] remove banner image requested',
  props<{payload: blobRemoveDto}>()
);

export const saveBannerRequest = createAction(
  '[Drawer Component] save banner requested',
  props<{payload: BannersSaveDto}>()
);

export const uploadBannerImageRequest = createAction(
  '[Drawer Component] upload banner image requested',
  props<{payload: Blob}>()
);