export interface BannersFindDto {
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

export interface BannersSaveDto {
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

export interface BannerRemoveDto {
  id?: string;
}

export interface blobRemoveDto {
  blobIds?: string[];
}