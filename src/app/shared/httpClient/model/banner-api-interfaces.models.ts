export interface getBannersListPayload {
  includes?: string[];
  excludes?: string[];
  search?: string;
  ids?: string[];
  excludeIds?: string[];
  targetAudienceIds?: string[];
  query?: {};
  sortBy?: string;
  sortDirection?: string;
  pageIndex?: number;
  pageSize?: number;
  searchAfter?: string[];
}

export interface saveBannerPayload {
  id?: string;
  name?: string;
  isCorporate?: boolean;
  channelId?: string;
  fileId?: string;
  language?: string;
  zoneId?: string;
  startDate?: Date;
  endDate?: Date;
  url?: string;
  active?: boolean;
  priority?: number;
  labels?: string[];
}

export interface removeBannerPayload {
  id?: string;
}

export interface referenceDataPayload {
  typeId?: string;
  subTypeId?: string;
  parentId?: string;
  path?: string;
  typeIds?: string[];
  excludeKeys?: string[];
  keys?: string[];
  autocomplete?: true;
  includes?: string[];
  excludes?: string[];
  search?: string;
  ids?: string[];
  excludeIds?: string[];
  targetAudienceIds?: string[];
  query?: {};
  sortBy?: string;
  sortDirection?: string;
  pageIndex?: number;
  pageSize?: number;
  searchAfter?: string[];
}

export interface removeBannerImagePayload {
  blobIds?: string[];
}