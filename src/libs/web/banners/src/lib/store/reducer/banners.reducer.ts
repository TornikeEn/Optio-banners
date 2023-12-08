import { createReducer, on } from '@ngrx/store';
import { BannersState, adapter } from '../state';
import { editBannerRequest, queryParamsChanged, referenceDataFindRequest, removeBannerRequest, saveBannerRequest } from '../actions/banners-list-page.actions';
import { bannerApiRemoveSuccess, bannersApiFindFail, bannersApiFindOneSuccess, bannersApiFindSuccess, referenceDataApiFindSuccess, removeBlobApiSuccess, saveBannerApiSuccess, uploadBlobApiSuccess } from '../actions/banners-api.actions';

export const initialState: BannersState = adapter.getInitialState({
    bannersList: [],
    total: 0,
    errorDetected: false,
    loading: false,
    formLoading: false,
    bannerDetails: null,
    channelTypeId: '1600',
    zoneTypeId: '1700',
    labelTypeId: '1900',
    languageTypeId: '2900',
    channels: [],
    zones: [],
    labels: [],
    languages: [],
    removeBannerImageResponse: null,
    saveBannerResponse: null,
    uploadBannerImageResponse: null,
});


export const bannersReducer = createReducer(
  initialState,
  on(queryParamsChanged, (state) => {
    return {...state, loading: true}
  }),
  on(bannersApiFindSuccess, (state, { data, blobPath }) => {
    let newEntities = [...data.entities];
    let newData = {...data, entities: newEntities};
    newData.entities = newData.entities.map((element: any) => {
      return {
        ...element,
        imgSrc: `${blobPath}${element.fileId}?${Math.random()}`,
      };
    });
    return adapter.setAll(newData.entities, {...state, total: newData.total, loading: false});
  }),
  on(bannersApiFindFail, (state) => {
    return {...state, errorDetected: false, loading: false};
  }),
  on(removeBannerRequest, (state) => {
    return {...state, loading: true}
  }),
  on(bannerApiRemoveSuccess, (state, {id}) => {
    return adapter.removeOne(id, {...state, loading: false, total: state.total - 1})
  }),
  on(editBannerRequest, (state) => {
    return {...state, formLoading: true}
  }),
  on(bannersApiFindOneSuccess, (state, {bannerDetails}) => {
    const updatedBannerDetails = {...bannerDetails}
    updatedBannerDetails['imgSrc'] = `https://development.api.optio.ai/api/v2/blob/${bannerDetails.fileId}?${Math.random()}`
    return {...state, bannerDetails: {...updatedBannerDetails}, formLoading: false}
  }),
  on(referenceDataFindRequest, (state) => {
    return {...state, loading: true}
  }),
  on(referenceDataApiFindSuccess, (state, {refData}) => {
    const channels = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    const zones = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    const labels = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    const languages = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    return {...state, channels, zones, labels, languages, loading: false}
  }),
  on(removeBlobApiSuccess, (state, {response}) => {
    return {...state, removeBannerImageResponse: response}
  }),
  on(uploadBlobApiSuccess, (state, {response}) => {
    return {...state, uploadBannerImageResponse: response}
  }),
  on(saveBannerRequest, (state) => {
      return {...state, formLoading: true}
  }),
  on(saveBannerApiSuccess, (state, {response}) => {
      const updatedBannerDetails = {...response.data}
      updatedBannerDetails['imgSrc'] = `https://development.api.optio.ai/api/v2/blob/${response.data.fileId}?${Math.random()}`
      return adapter.upsertOne(updatedBannerDetails, {...state, saveBannerResponse: response, total: state.total + 1, formLoading: false})
  })
);
