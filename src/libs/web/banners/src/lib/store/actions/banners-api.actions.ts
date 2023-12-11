import { createAction, props } from '@ngrx/store';

export const bannersApiFindSuccess = createAction(
    '[Banners Api] find successed',
    props<{data: any}>()
  );
  
export const bannersApiFindFail = createAction(
  '[Banners Api] find failed'
  )
    
export const bannersApiFindOneSuccess = createAction(
  '[Banners Api] find one successed',
  props<{bannerDetails: any}>()
);
    
export const bannerApiRemoveSuccess = createAction(
    '[Banners Api] remove successed',
    props<{id: string}>()
  )

export const bannerApiRemoveFail = createAction(
    '[Banners Api] remove failed'
  )

export const saveBannerApiSuccess = createAction(
    '[Banners Api] save successed',
      props<{response: any}>()
  )

export const referenceDataApiFindSuccess = createAction(
    '[Reference Data Api] find successed',
      props<{refData: any}>()
  )

export const removeBlobApiSuccess = createAction(
    '[Blob Api] remove successed',
      props<{response: any}>()
  )

export const uploadBlobApiSuccess = createAction(
    '[Blob Api] upload successed',
      props<{response: any}>()
  )