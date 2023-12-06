import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';

import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';

import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';

import { ConfirmationDialogComponent } from 'src/libs/web/shared/src/components/confirmation-dialog.component';

@Component({
  selector: 'app-banners-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

export class BannersListComponent implements OnInit, OnDestroy {
  @Input() blobPath!: string;
  @Input() displayedColumns!: string[];

  @Input() pageSizeOptions!: number[];
  @Input() pageSize!: number;
  @Input() pageIndex!: number;

  @Input() filterParams!: Record<string,any>;

  @Input() bannersList: any;
  @Input() total: any;
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
  
  sortByPropertyHandler(event: MatSelectChange): void {
    this.filterParamsChange.emit({...this.filterParams, sortBy: event.value});
  }

  sortByDirectionHandler(event: MatSelectChange): void {
    this.filterParamsChange.emit({...this.filterParams, sortDirection: event.value});
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
