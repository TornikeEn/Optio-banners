export interface referenceDataFindDto {
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