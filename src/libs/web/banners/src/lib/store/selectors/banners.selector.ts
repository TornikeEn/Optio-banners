import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BannersState, adapter } from '../state';

const { selectAll: entitiesSelectAll } = adapter.getSelectors();

export const selectBannersState = createFeatureSelector<BannersState>('banners');

export const selectBannersList = createSelector(
    selectBannersState,
    entitiesSelectAll
)

export const selectTotal = createSelector(
    selectBannersState,
    (state: BannersState) => state.total
)

export const selectErrorDetected = createSelector(
    selectBannersState,
    (state: BannersState) => state.errorDetected
)

export const selectLoading = createSelector(
    selectBannersState,
    (state: BannersState) => state.loading
)

export const selectFormLoading = createSelector(
    selectBannersState,
    (state: BannersState) => state.formLoading
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
export const selectZonesDisplayObj = createSelector(
    selectBannersState,
    (state: BannersState) => state.zonesDisplayObj
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

export const selectBlobPath = createSelector(
    selectBannersState,
    (state: BannersState) => state.blobPath
)