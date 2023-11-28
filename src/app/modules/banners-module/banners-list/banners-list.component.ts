import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { BannersState } from '../store/banners.reducer';
import { getBannersList, onEditBanner, removeBanner } from '../store/banners.actions';
import { selectBannersList, selectErrorDetected, selectLoading } from '../store/banners.selector';

import { SessionStorageService } from 'src/app/shared/services/sessionStorage.service';

import { environment } from 'src/environments/environment';

import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';



@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss']
})

export class BannersListComponent implements OnInit, AfterViewInit, OnDestroy {
  blobPath: string = `${environment.apiUrl}/blob/`;

  displayedColumns: string[] = ['image', 'name', 'status', 'zone', 'startDate', 'endDate', 'labels', 'actions'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [10, 30, 50];
  pageSize: number = 10;
  pageIndex: number = 0;

  filterParams!: Record<string,any>;
  searchKeyUp$ = new Subject<string>();
  initialTableSub!: Subscription;

  @Output() openDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();

  bannersListSelector$ = this._store.select(selectBannersList);
  errorDetectedSelector$ = this._store.select(selectErrorDetected);
  selectLoading$ = this._store.select(selectLoading);
  
  constructor(private _dialog: MatDialog, private _sessionStorageService: SessionStorageService, private _store: Store<BannersState>) {}

  ngOnInit(): void {
    this.getFilterParams();
  }

  ngAfterViewInit(): void {
    this.searchKeyUp$.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((value: string) => {
      this.paginator.firstPage();
      this.filterParams = {...this.filterParams, search: value}
      this.getBannersList(this.filterParams);
    });  
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

  applySearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchKeyUp$.next(searchValue);
  }
  
  sortByProperty(event: MatSelectChange): void {
    this.filterParams = {...this.filterParams, sortBy: event.value}
    this.getBannersList(this.filterParams);
  }

  sortByDirection(event: MatSelectChange): void {
    this.filterParams = {...this.filterParams, sortDirection: event.value}
    this.getBannersList(this.filterParams);
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.filterParams = {...this.filterParams, pageIndex: this.pageIndex, pageSize: this.pageSize}
    this.getBannersList(this.filterParams)
  }

  removeBanner(id: string): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Remove banner`,
        message: `Are you sure you want to proceed with this operation?`
      },
      panelClass: 'mobile-responsive-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this._store.dispatch(removeBanner({payload: {id}, blobPath: this.blobPath}));
      }
    });
  }

  editBanner(bannerDetails: any): void {
    this.openDrawer.emit(true);
    this._store.dispatch(onEditBanner({bannerDetails}));
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.searchKeyUp$.unsubscribe;
    this.initialTableSub.unsubscribe;
  }

}
