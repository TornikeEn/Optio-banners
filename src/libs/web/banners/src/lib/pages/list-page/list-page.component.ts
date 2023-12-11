import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { BannersState } from '../../store/state';
import { selectBannerInfo, selectBannersList, selectBlobPath, selectChannels, selectErrorDetected, selectFormLoading, selectLabels, selectLanguages, selectLoading, selectRemoveBannerImageResponse, selectSaveBannerResponse, selectTotal, selectUploadBannerImageResponse, selectZones, selectZonesDisplayObj } from 'src/libs/web/banners/src/lib/store/selectors/banners.selector';
import { queryParamsChanged, referenceDataFindRequest, editBannerRequest, removeBannerRequest, removeBannerImageRequest, uploadBannerImageRequest, saveBannerRequest, routerNavigateRequested } from 'src/libs/web/banners/src/lib/store/actions/banners-list-page.actions';

@Component({
    selector: 'app-list-page',
    templateUrl: './list-page.component.html',
    styleUrls: ['./list-page.component.scss']
  })
  
  export class DrawerPageComponent implements OnInit {
    drawerOpened: boolean = false;
    displayedColumns: string[] = ['image', 'name', 'status', 'zone', 'startDate', 'endDate', 'labels', 'actions'];
  
    pageSizeOptions: number[] = [10, 30, 50];
    pageSize: number = 10;
    pageIndex: number = 0;
  
    oldQueryParams!: Record<string,any>;
    filterParams!: Record<string,any>;
  
    blobPathSelector$ = this._store.select(selectBlobPath);

    bannersListSelector$ = this._store.select(selectBannersList);
    totalSelector$ = this._store.select(selectTotal);
    errorDetectedSelector$ = this._store.select(selectErrorDetected);
    selectLoading$ = this._store.select(selectLoading);
    selectFormLoading$ = this._store.select(selectFormLoading);
  
    channelTypeId: string = '1600';
    zoneTypeId: string = '1700';
    labelTypeId: string = '1900';
    languageTypeId: string = '2900';
  
    fileId: any;
    editMode!: boolean;
    selectedBannerId: string = '';
  
    selectChannels$ = this._store.select(selectChannels);
    selectZones$ = this._store.select(selectZones);
    selectZonesDisplayObj$ = this._store.select(selectZonesDisplayObj);
    selectLabels$ = this._store.select(selectLabels);
    selectLanguages$ = this._store.select(selectLanguages);
  
    selectBannerDetails$ = this._store.select(selectBannerInfo);
    selectRemoveBannerImageResponse$ = this._store.select(selectRemoveBannerImageResponse);
    selectSaveBannerResponse$ = this._store.select(selectSaveBannerResponse);
    selectUploadBannerImageResponse$ = this._store.select(selectUploadBannerImageResponse);
  
  
  
  
    constructor(private _store: Store<BannersState>, private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      this.getReferenceData();
      this.getFilterParams();
    }

    getFilterParams(): void {
      this.route.queryParams.subscribe(queryParams => {
        let savedFilterParams;
        if(Object.keys(queryParams).length === 0) {
          savedFilterParams = {
            search: '',
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          };
          // this.oldQueryParams = savedFilterParams;
        } else {
          savedFilterParams = queryParams;
          this.pageSize = queryParams['pageSize'];
          this.pageIndex = queryParams['pageIndex'];
        }
        this.filterParams = savedFilterParams;
        this.drawerOpened = this.filterParams['drawerOpened'] === 'true' ? true : false;
        this.selectedBannerId = this.filterParams['bannerId'];
        if(this.selectedBannerId) {
          this._store.dispatch(editBannerRequest({bannerId: this.selectedBannerId}));
        }
        this.filterParams = {...this.filterParams};
        if(this.filterParams['drawerOpened']) {
          delete this.filterParams['drawerOpened'];
        }
        if(this.filterParams['bannerId']) {
          delete this.filterParams['bannerId'];
        }
        if(this.areQueryParamsEqual(this.oldQueryParams, this.filterParams) === false) {
          this.getBannersList(this.filterParams);
        }
      });
    }

    areQueryParamsEqual(params1: any, params2: any): boolean {
      if(!params1 || !params2) {
        return false;
      }

      const keys = Object.keys(params2);

      for (const key of keys) {
        if (params1[key] != params2[key]) {
          // Values are different
          return false;
        }
      }
      // All values are equal
      return true;
    }
  
    getBannersList(params: any) {
      this._store.dispatch(queryParamsChanged({payload: params}));
      this.oldQueryParams = {...params};
    }
  
    onfilterParamsChange(event: any) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.oldQueryParams = {...this.filterParams}
      this.filterParams = event;
      this._store.dispatch(routerNavigateRequested({queryParams: {...event}}));
    }

    onAddNewBanner() {
      this.drawerOpened = true;

      const newFilterParams: {[index: string]:any}  = {};
    
      for (const key in this.filterParams) {
        if (this.filterParams[key] !== null) {
          newFilterParams[key] = this.filterParams[key];
        }
      }
      this.filterParams = newFilterParams;
      this._store.dispatch(routerNavigateRequested({queryParams: {...this.filterParams, drawerOpened: this.drawerOpened}}));
    }
  
    onOpenDrawer(bannerId: string) {
      this.drawerOpened = true;
      this._store.dispatch(routerNavigateRequested({queryParams: {...this.filterParams, drawerOpened: this.drawerOpened, bannerId: bannerId}}));
    }
  
    onDeleteClicked(id: string) {
      this._store.dispatch(removeBannerRequest({payload: {id}}));
    }
  
    getReferenceData(): void {
      const payload = {
        typeIds: [this.channelTypeId, this.zoneTypeId, this.labelTypeId, this.languageTypeId],
        pageSize: 500
      }
      
      this._store.dispatch(referenceDataFindRequest({payload}));
    }
  
    fileIdChangedHandler(fileId: any) {
      this.fileId = fileId;
    }
  
    onRemoveImageClick(): void {
      if(this.editMode && this.fileId) {
      const payload = {
        blobIds: [this.fileId]
        }
        this._store.dispatch(removeBannerImageRequest({payload}));
        }
    }
    
    onOldImageRemove(payload: any) {
      this._store.dispatch(removeBannerImageRequest({payload: {blobIds: [payload.fileId]}}));
    }

    onNewImageUpload(selectedFile: any) {
      this._store.dispatch(uploadBannerImageRequest({payload: selectedFile}));
      
    }

    onSaveBannerRequest(payload: any) {
          this._store.dispatch(saveBannerRequest({payload}));
    }
  
    onCollapse() {
      if(this.editMode && this.fileId === null) {
        this.editMode = true;
        this._store.dispatch(queryParamsChanged({payload: this.filterParams}));
      }
      this.drawerOpened = false;
      if(this.filterParams['bannerId']) {
        this.filterParams = {...this.filterParams}
        delete this.filterParams['bannerId'];
      }
      this._store.dispatch(routerNavigateRequested({queryParams: {...this.filterParams, drawerOpened: this.drawerOpened}}));
    }
  }
  