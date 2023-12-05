import { createAction, props } from '@ngrx/store';

export const bannersApiFindSuccess = createAction(
    '[Banners Api] find banners list successed',
    props<{data: any, blobPath: string}>()
  );

export const bannersApiFindFail = createAction(
    '[Banners Api] find banners list failed'
  )

export const bannerRemoveSuccess = createAction(
    '[Banners Api] banner remove successed',
    props<{id: string}>()
  )

export const bannerRemoveFail = createAction(
    '[Banners Api] banner remove failed'
  )

export const referenceDataApiFindSuccess = createAction(
    '[Banners Api] reference data find successed',
      props<{refData: any}>()
  )

export const removeBannerImageApiSuccess = createAction(
    '[Banners Api] remove banner image successed',
      props<{response: any}>()
  )

export const saveBannerApiSuccess = createAction(
    '[Banners Api] save banner successed',
      props<{response: any}>()
  )

export const uploadBannerImageApiSuccess = createAction(
    '[Banners Api] upload banner image successed',
      props<{response: any}>()
  )