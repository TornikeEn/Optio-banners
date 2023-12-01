import { createReducer, on } from '@ngrx/store';
import { getBannersList, getReferenceData, onEditBanner, removeBanner } from './banners.actions';
import { bannerRemoveSuccess, bannersApiFindFail, bannersApiFindSuccess, referenceDataApiFindSuccess, removeBannerImageApiSuccess, saveBannerApiSuccess, uploadBannerImageApiSuccess } from './banners-api.actions';
import { EntityAdapter, EntityState, createEntityAdapter } from '@ngrx/entity';

export interface BannerList {
  bannersList: Banner[];
}

export interface Banner {
  id: number,
  name: string,
  active: null | undefined,
  startDate: string,
  endDate: string | null,
  labels: string[],
  zoneId: string,
  url: string,
  fileId: string | null | undefined,
  channelId: string,
  language: string,
  priority: string
}

export interface BannersState extends EntityState<BannerList> {
  total: number;
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

export const adapter: EntityAdapter<BannerList> = createEntityAdapter();

export const initialState: BannersState = adapter.getInitialState({
    bannersList: [],
    total: 0,
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
});


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
    // return { ...state, bannersList: newData.entities, total: newData.total, loading: false };
    return adapter.addMany(newData.entities, {...state, total: newData.total, loading: false});
  }),
  on(bannersApiFindFail, (state) => {
    return {...state, errorDetected: false, loading: false};
  }),
  on(removeBanner, (state) => {
    return {...state, loading: true}
  }),
  on(bannerRemoveSuccess, (state, {id}) => {
    return adapter.removeOne(id, {...state, loading: false, total: state.total - 1})
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
  on(uploadBannerImageApiSuccess, (state, {response}) => {
    return {...state, uploadBannerImageResponse: response}
  }),
  on(saveBannerApiSuccess, (state, {response}) => {
      return adapter.upsertOne(response.data, {...state, saveBannerResponse: response, total: state.total + 1})
  })
);
