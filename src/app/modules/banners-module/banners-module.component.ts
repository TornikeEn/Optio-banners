import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { BannersState } from './store/banners.reducer';
import { selectBannersList, selectErrorDetected, selectLoading } from './store/banners.selector';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage.service';
import { getBannersList, onEditBanner, removeBanner } from './store/banners.actions';

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
  errorDetectedSelector$ = this._store.select(selectErrorDetected);
  selectLoading$ = this._store.select(selectLoading);

  constructor(private _store: Store<BannersState>, private _sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.getFilterParams();
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

}
