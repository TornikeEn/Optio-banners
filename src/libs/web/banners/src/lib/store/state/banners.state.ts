import { EntityAdapter, EntityState, createEntityAdapter } from "@ngrx/entity";
export interface BannerList {
  bannersList: Banner[];
}

export interface Banner {
  id: number;
  name: string;
  active: null | undefined;
  startDate: string;
  endDate: string | null;
  labels: string[];
  zoneId: string;
  url: string;
  fileId: string | null | undefined;
  channelId: string;
  language: string;
  priority: string;
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