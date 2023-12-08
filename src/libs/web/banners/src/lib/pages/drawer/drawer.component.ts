import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { environment } from 'src/environments/environment';

import { BannersState } from '../../store/state';
import { selectBannerInfo, selectBannersList, selectChannels, selectErrorDetected, selectFormLoading, selectLabels, selectLanguages, selectLoading, selectRemoveBannerImageResponse, selectSaveBannerResponse, selectTotal, selectUploadBannerImageResponse, selectZones } from 'src/libs/web/banners/src/lib/store/selectors/banners.selector';
import { queryParamsChanged, referenceDataFindRequest, editBannerRequest, removeBannerRequest, removeBannerImageRequest, uploadBannerImageRequest, saveBannerRequest } from 'src/libs/web/banners/src/lib/store/actions/banners-list-page.actions';

@Component({
    selector: 'app-drawer',
    templateUrl: './drawer.component.html',
    styleUrls: ['./drawer.component.scss']
  })
  
  export class DrawerPageComponent implements OnInit {
    blobPath: string = `${environment.apiUrl}/blob/`;
    drawerOpened: boolean = false;
    displayedColumns: string[] = ['image', 'name', 'status', 'zone', 'startDate', 'endDate', 'labels', 'actions'];
  
    pageSizeOptions: number[] = [10, 30, 50];
    pageSize: number = 10;
    pageIndex: number = 0;
  
    filterParams!: Record<string,any>;
  
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
    selectLabels$ = this._store.select(selectLabels);
    selectLanguages$ = this._store.select(selectLanguages);
  
    selectBannerDetails$ = this._store.select(selectBannerInfo);
    selectRemoveBannerImageResponse$ = this._store.select(selectRemoveBannerImageResponse);
    selectSaveBannerResponse$ = this._store.select(selectSaveBannerResponse);
    selectUploadBannerImageResponse$ = this._store.select(selectUploadBannerImageResponse);
  
  
  
  
    constructor(private _store: Store<BannersState>, private route: ActivatedRoute, private router: Router) {}
  
    ngOnInit(): void {
      this.getFilterParams();
      this.getReferenceData();
    }

    getFilterParams(): void {
      this.route.queryParams.subscribe(queryParams => {
        let savedFilterParams;
        if(Object.keys(queryParams).length === 0) {
          savedFilterParams = {
            search: '',
            sortBy: null,
            sortDirection: null,
            pageIndex: this.pageIndex,
            pageSize: this.pageSize,
          };
        } else {
          savedFilterParams = queryParams;
          this.pageSize = queryParams['pageSize'];
          this.pageIndex = queryParams['pageIndex'];
        }
        this.filterParams = savedFilterParams;
        this.drawerOpened = this.filterParams['drawerOpened'];
        this.selectedBannerId = this.filterParams['bannerId'];
        if(this.selectedBannerId) {
          this._store.dispatch(editBannerRequest({bannerId: this.selectedBannerId}));
        }
        this.getBannersList(this.filterParams);
      });
    }
  
    getBannersList(params: any) {
      const payload = {...params};
      if(payload['drawerOpened']) {
        delete payload['drawerOpened'];
      }
      if(payload['bannerId']) {
        delete payload['bannerId'];
      }
      this._store.dispatch(queryParamsChanged({payload: payload, blobPath: this.blobPath}));
    }
  
    onfilterParamsChange(event: any) {
      this.pageIndex = event.pageIndex;
      this.pageSize = event.pageSize;
      this.filterParams = event;
      this.router.navigate(['/'], {
        queryParams: {...event}
      });
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
      this.router.navigate(['/'], {
        queryParams: {...this.filterParams, drawerOpened: this.drawerOpened}
      });
    }
  
    onOpenDrawer(bannerId: string) {
      this.drawerOpened = true;
      this._store.dispatch(editBannerRequest({bannerId}));
      this.router.navigate(['/'], {
        queryParams: {...this.filterParams, drawerOpened: this.drawerOpened, bannerId: bannerId}
      });
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
        this._store.dispatch(queryParamsChanged({payload: this.filterParams, blobPath: this.blobPath}));
      }
      this.drawerOpened = false;
      if(this.filterParams['bannerId']) {
        this.filterParams = {...this.filterParams}
        delete this.filterParams['bannerId'];
      }
      this.router.navigate(['/'], {
        queryParams: {...this.filterParams, drawerOpened: this.drawerOpened}
      });
    }
  }
  