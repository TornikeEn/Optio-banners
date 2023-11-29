import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { BannersState } from '../store/banners.reducer';

import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-banners-list',
  templateUrl: './banners-list.component.html',
  styleUrls: ['./banners-list.component.scss']
})

export class BannersListComponent implements AfterViewInit, OnDestroy {
  @Input() blobPath!: string;
  @Input() displayedColumns!: string[];

  @Input() pageSizeOptions!: number[];
  @Input() pageSize!: number;
  @Input() pageIndex!: number;

  @Input() filterParams!: Record<string,any>;

  @Input() bannersListSelector: any;
  @Input() errorDetectedSelector: any;
  @Input() selectLoading: any;

  @Output() openDrawer: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteBanner: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterBannerList: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchKeyUp$ = new Subject<string>();
 
  constructor(private _dialog: MatDialog, private _store: Store<BannersState>) {}

  ngAfterViewInit(): void {
    this.searchKeyUp$.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((value: string) => {
      this.paginator.firstPage();
      this.filterBannerList.emit({...this.filterParams, search: value});
    });  
  }

  applySearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchKeyUp$.next(searchValue);
  }
  
  sortByPropertyHandler(event: MatSelectChange): void {
    this.filterBannerList.emit({...this.filterParams, sortBy: event.value});
  }

  sortByDirectionHandler(event: MatSelectChange): void {
    this.filterBannerList.emit({...this.filterParams, sortDirection: event.value});
  }

  changePageHandler(event: PageEvent) {
    this.filterBannerList.emit({...this.filterParams, pageIndex: this.pageIndex, pageSize: this.pageSize});
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
        this.deleteBanner.emit(id);
      }
    });
  }

  editBanner(bannerDetails: any): void {
    this.openDrawer.emit(bannerDetails);
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.searchKeyUp$.unsubscribe;
  }

}
