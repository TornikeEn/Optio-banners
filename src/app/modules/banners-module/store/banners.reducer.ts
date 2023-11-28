import { createReducer, on } from '@ngrx/store';
import { getBannersList, getReferenceData, onEditBanner, removeBanner } from './banners.actions';
import { bannersApiFindFail, bannersApiFindSuccess, referenceDataApiFindSuccess, removeBannerImageApiSuccess } from './banners-api.actions';

export interface BannersState {
  bannersList: {entities: any; searchAfter?: any; total: number};
  errorDetected: boolean;
  loading: boolean;
  bannerDetails: any;
  channelTypeId: string;
  zoneTypeId: string;
  labelTypeId: string;
  languageTypeId: string;
  channels: any;
  zones: any;
  labels: any;
  languages: any;
  removeBannerImageResponse: any;
  saveBannerResponse: any;
  uploadBannerImageResponse: any;
}

export const initialState: BannersState = {
    bannersList: {entities: [], total: 0},
    errorDetected: false,
    loading: false,
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
};

export const bannersReducer = createReducer(
  initialState,
  on(getBannersList, (state) => {
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
    return { ...state, bannersList: newData, loading: false };
  }),
  on(bannersApiFindFail, (state) => {
    return {...state, errorDetected: false, loading: false};
  }),
  on(removeBanner, (state) => {
    return {...state, loading: true}
  }),
  on(onEditBanner, (state, {bannerDetails}) => {
    return {...state, bannerDetails: {...bannerDetails}}
  }),
  on(getReferenceData, (state) => {
    return {...state, loading: true}
  }),
  on(referenceDataApiFindSuccess, (state, {refData}) => {
    const channels = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    const zones = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    const labels = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    const languages = refData.entities.filter((element: any) => element.typeId === state.channelTypeId);
    return {...state, channels, zones, labels, languages, loading: false}
  }),
  on(removeBannerImageApiSuccess, (state, {response}) => {
    return {...state, removeBannerImageResponse: response}
  }),
);
