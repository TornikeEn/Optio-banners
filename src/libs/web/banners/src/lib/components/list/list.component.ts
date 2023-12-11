import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Sort } from '@angular/material/sort';

import { ConfirmationDialogComponent } from 'src/libs/web/shared/src/components/confirmation-dialog.component';

@Component({
  selector: 'app-banners-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class BannersListComponent implements OnInit, OnDestroy {
  @Input() blobPath: string | null = null;
  @Input() displayedColumns!: string[];

  @Input() pageSizeOptions!: number[];
  @Input() pageSize!: number;
  @Input() pageIndex!: number;

  @Input() filterParams!: Record<string,any>;

  @Input() bannersList: any;
  @Input() total: any;
  @Input() zonesDisplayObj: any;
  @Input() errorDetected: any;
  @Input() loading: any;

  @Output() openDrawer: EventEmitter<any> = new EventEmitter<any>();
  @Output() deleteClicked: EventEmitter<string> = new EventEmitter<string>();
  @Output() filterParamsChange: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchKeyUp$ = new Subject<string>();
 
  constructor(private _dialog: MatDialog) { }

  ngOnInit(): void {
    this.searchKeyUp$.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((value: string) => {
      this.paginator.firstPage();
      this.filterParamsChange.emit({...this.filterParams, search: value});   
    });
  }

  applySearch(event: Event) {
    const searchValue = (event.target as HTMLInputElement).value;
    this.searchKeyUp$.next(searchValue);
  }

  onMatSortChange(sortState: Sort) {
    if (sortState.direction) {
      switch (sortState.active) {
        case 'name':
          this.filterParams = {...this.filterParams, sortDirection: sortState.direction, sortBy: 'name.raw'};
          break;
        case 'status':
          this.filterParams = {...this.filterParams, sortDirection: sortState.direction, sortBy: 'active'};
          break;
        case 'zone':
          this.filterParams = {...this.filterParams, sortDirection: sortState.direction, sortBy: 'zoneId'};
          break;
        case 'startDate':
          this.filterParams = {...this.filterParams, sortDirection: sortState.direction, sortBy: sortState.active};
          break;
        case 'endDate':
          this.filterParams = {...this.filterParams, sortDirection: sortState.direction, sortBy: sortState.active};
          break;
        default:
          this.filterParams = {...this.filterParams, sortDirection: null, sortBy: null};
          break;
      }
    } else {
      this.filterParams = {...this.filterParams, sortDirection: null, sortBy: null};
    }
    this.filterParamsChange.emit({...this.filterParams});
  }

  changePageHandler(event: PageEvent) {
    this.filterParamsChange.emit({...this.filterParams, pageIndex: event.pageIndex, pageSize: event.pageSize});
  }

  onRemove(id: string): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Remove banner`,
        message: `Are you sure you want to proceed with this operation?`
      },
      panelClass: 'mobile-responsive-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.deleteClicked.emit(id);
      }
    });
  }

  onEdit(bannerDetails: any): void {
    this.openDrawer.emit(bannerDetails.id);
  }

  handleImageError(event: Event): void {
    const imgElement = event.target as HTMLImageElement;
    imgElement.style.display = 'none';
  }

  ngOnDestroy(): void {
    this.searchKeyUp$.unsubscribe;
  }

}
