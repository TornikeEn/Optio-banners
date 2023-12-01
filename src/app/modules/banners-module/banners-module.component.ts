import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { BannersState } from './store/banners.reducer';
import { selectBannerInfo, selectBannersList, selectChannels, selectErrorDetected, selectLabels, selectLanguages, selectLoading, selectRemoveBannerImageResponse, selectSaveBannerResponse, selectTotal, selectUploadBannerImageResponse, selectZones } from './store/banners.selector';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage.service';
import { getBannersList, getReferenceData, onEditBanner, removeBanner, removeBannerImage } from './store/banners.actions';

@Component({
  selector: 'app-banners-module',
  templateUrl: './banners-module.component.html',
  styleUrls: ['./banners-module.component.scss']
})

export class BannersModuleComponent implements OnInit {
  blobPath: string = `${environment.apiUrl}/blob/`;
  displayedColumns: string[] = ['image', 'name', 'status', 'zone', 'startDate', 'endDate', 'labels', 'actions'];

  pageSizeOptions: number[] = [10, 30, 50];
  pageSize: number = 10;
  pageIndex: number = 0;

  filterParams!: Record<string,any>;

  bannersListSelector$ = this._store.select(selectBannersList);
  totalSelector$ = this._store.select(selectTotal);
  errorDetectedSelector$ = this._store.select(selectErrorDetected);
  selectLoading$ = this._store.select(selectLoading);

  channelTypeId: string = '1600';
  zoneTypeId: string = '1700';
  labelTypeId: string = '1900';
  languageTypeId: string = '2900';

  fileId: any;
  editMode!: boolean;

  selectChannels$ = this._store.select(selectChannels);
  selectZones$ = this._store.select(selectZones);
  selectLabels$ = this._store.select(selectLabels);
  selectLanguages$ = this._store.select(selectLanguages);

  selectBannerDetails$ = this._store.select(selectBannerInfo);
  selectRemoveBannerImageResponse$ = this._store.select(selectRemoveBannerImageResponse);
  selectSaveBannerResponse$ = this._store.select(selectSaveBannerResponse);
  selectUploadBannerImageResponse$ = this._store.select(selectUploadBannerImageResponse);




  constructor(private _store: Store<BannersState>, private _sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.getFilterParams();
    this.getReferenceData();
  }

  getFilterParams(): void {
    const savedFilterParams = this._sessionStorageService.get('bannersListFilterParams');
    if(savedFilterParams) {
      this.filterParams = savedFilterParams;
    } else {
      this.filterParams = {
        search: null,
        sortBy: null,
        sortDirection: null,
        pageIndex: this.pageIndex,
        pageSize: this.pageSize
      };
    }
    this.getBannersList(this.filterParams);
  }

  getBannersList(params: any) {
    this._store.dispatch(getBannersList({payload: params, blobPath: this.blobPath}));
  }

  filterBannerList(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.filterParams = event;
    this.getBannersList(this.filterParams);
  }

  onEditBanner(bannerDetails: any) {
    this._store.dispatch(onEditBanner({bannerDetails}));
  }

  deleteBanner(id: string) {
    this._store.dispatch(removeBanner({payload: {id}, blobPath: this.blobPath}));
  }

  getReferenceData(): void {
    const payload = {
      typeIds: [this.channelTypeId, this.zoneTypeId, this.labelTypeId, this.languageTypeId],
      pageSize: 500
    }
    
    this._store.dispatch(getReferenceData({payload}));
  }

  fileIdChangedHandler(fileId: any) {
    this.fileId = fileId;
  }

  removeBannerImageHandler(): void {
    if(this.editMode && this.fileId) {
    const payload = {
      blobIds: [this.fileId]
      }
      this._store.dispatch(removeBannerImage({payload}));
      }
  }

  refreshList() {
    if(this.editMode && this.fileId === null) {
      this.editMode = true;
      this._store.dispatch(getBannersList({payload: undefined, blobPath: this.blobPath}));
    }
  }

}
