import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BannersState } from './banners.reducer';

export const selectBannersState = createFeatureSelector<BannersState>('banners');

export const selectBannersList = createSelector(
    selectBannersState,
    (state: BannersState) => state.bannersList
)

export const selectErrorDetected = createSelector(
    selectBannersState,
    (state: BannersState) => state.errorDetected
)

export const selectLoading = createSelector(
    selectBannersState,
    (state: BannersState) => state.loading
)

export const selectBannerInfo = createSelector(
    selectBannersState,
    (state: BannersState) => state.bannerDetails
)

export const selectChannels = createSelector(
    selectBannersState,
    (state: BannersState) => state.channels
)

export const selectZones = createSelector(
    selectBannersState,
    (state: BannersState) => state.zones
)

export const selectLabels = createSelector(
    selectBannersState,
    (state: BannersState) => state.labels
)

export const selectLanguages = createSelector(
    selectBannersState,
    (state: BannersState) => state.languages
)

export const selectRemoveBannerImageResponse = createSelector(
    selectBannersState,
    (state: BannersState) => state.removeBannerImageResponse
)

export const selectSaveBannerResponse = createSelector(
    selectBannersState,
    (state: BannersState) => state.saveBannerResponse
)

export const selectUploadBannerImageResponse = createSelector(
    selectBannersState,
    (state: BannersState) => state.uploadBannerImageResponse
)