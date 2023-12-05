import { createAction, props } from '@ngrx/store';
import { getBannersListPayload, referenceDataPayload, removeBannerImagePayload, removeBannerPayload, saveBannerPayload } from 'src/libs/web/banners/src/lib/store/types/banners-api.interface';

export const getBannersList = createAction(
  '[Banners List Component] get banners list',
  props<{payload: getBannersListPayload | undefined, blobPath: string}>()
);

export const removeBanner = createAction(
  '[Banners List Component] remove banner',
  props<{payload: removeBannerPayload, blobPath: string}>()
);

export const onEditBanner = createAction(
  '[Banners List Component] edit banner',
  props<{bannerDetails: any}>()
);

export const getReferenceData = createAction(
  '[Add Or Update Banner Component] get reference data',
  props<{payload: referenceDataPayload}>()
);

export const removeBannerImage = createAction(
  '[Add Or Update Banner Component] remove banner image',
  props<{payload: removeBannerImagePayload}>()
);

export const saveBanner = createAction(
  '[Add Or Update Banner Component] save banner',
  props<{payload: saveBannerPayload}>()
);

export const uploadBannerImage = createAction(
  '[Add Or Update Banner Component] upload banner image',
  props<{payload: Blob}>()
);