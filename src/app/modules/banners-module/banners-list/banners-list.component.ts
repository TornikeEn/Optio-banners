import { AfterViewInit, Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { Subject, Subscription, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { BannersApiService } from 'src/app/shared/httpClient/api/banners-api.service';
import { BannersService } from '../banners.service';
import { SessionStorageService } from 'src/app/shared/services/sessionStorage.service';

import { environment } from 'src/environments/environment';

import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss']
})

export class BannersListComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns: string[] = ['image', 'name', 'status', 'zone', 'startDate', 'endDate', 'labels', 'actions'];
  dataSource = new MatTableDataSource();
  blobPath: string = `${environment.apiUrl}/blob/`

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  pageSizeOptions: number[] = [10, 30, 50];
  pageSize: number = 10;
  pageIndex: number = 0;
  dataLength: number | undefined;

  filterParams!: Record<string,any>
  searchKeyUp$ = new Subject<string>();
  httpRequestSubscription = {closed: false};
  initialTableSub!: Subscription;
  errorDetected: boolean = false;
  @Output() openDrawer: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor(private _bannersApiService: BannersApiService, private _dialog: MatDialog, private _bannersService: BannersService, private _sessionStorageService: SessionStorageService) {}

  ngOnInit(): void {
    this.getFilterParams();
    this.initialTableSub = this._bannersService.updateBannersList$.subscribe(update => {
      if(update) {
        this.getBannersList(this.filterParams);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.searchKeyUp$.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((value: string) => {
      this.paginator.firstPage();
      this.filterParams = {...this.filterParams, search: value}
      this.saveFilterParams();
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
  }

  getBannersList(params: any) {
    this.httpRequestSubscription = this._bannersApiService.getBannersList(params).subscribe(res => {
      if (res.success) {
        this.dataLength = res.data.total;
        this.dataSource = new MatTableDataSource(res.data.entities);
        this.dataSource.data.map((element: any) => {
          element.imgSrc = `${this.blobPath}${element.fileId}?${Math.random()}`
          return element;
        })
      } else {
        this.errorDetected = true;
      }
    }, (error) => {
      this.errorDetected = true;
    })
  }

  applySearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchKeyUp$.next(searchValue);
  }
  
  sortByProperty(event: MatSelectChange): void {
    const sortValue = event.value;
    this.filterParams['sortBy'] = sortValue;
    this.saveFilterParams();
    this.getBannersList(this.filterParams);
  }

  sortByDirection(event: MatSelectChange): void {
    const sortDirectionValue = event.value;
    this.filterParams['sortDirection'] = sortDirectionValue;
    this.saveFilterParams();
    this.getBannersList(this.filterParams);
  }

  saveFilterParams(): void {
    this._sessionStorageService.set('bannersListFilterParams', this.filterParams)
  }

  changePage(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.filterParams['pageIndex'] = this.pageIndex;
    this.filterParams['pageSize'] = this.pageSize;
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
        this.httpRequestSubscription = this._bannersApiService.removeBanner({id}).subscribe((res) => {
          this.getBannersList(this.filterParams);
        });
      }
    });
  }

  editBanner(bannerDetails: any): void {
    this.openDrawer.emit(true);
    this._bannersService.bannerDetails$.next(bannerDetails);
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
