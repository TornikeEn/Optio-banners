import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { environment } from 'src/environments/environment';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

import { BannersState } from '../store/banners.reducer';
import { selectBannerInfo, selectChannels, selectLabels, selectLanguages, selectLoading, selectRemoveBannerImageResponse, selectSaveBannerResponse, selectUploadBannerImageResponse, selectZones } from '../store/banners.selector';
import { getBannersList, getReferenceData, removeBannerImage, saveBanner, uploadBannerImage } from '../store/banners.actions';

@Component({
  selector: 'app-add-or-update-banner',
  templateUrl: './add-or-update-banner.component.html',
  styleUrls: ['./add-or-update-banner.component.scss']
})

export class AddOrUpdateBannerComponent implements OnInit, OnDestroy {  
  blobPath: string = `${environment.apiUrl}/blob/`;

  channelTypeId: string = '1600';
  zoneTypeId: string = '1700';
  labelTypeId: string = '1900';
  languageTypeId: string = '2900';

  editMode: boolean = false;

  subscriptions: Subscription[] = [];

  bannerForm: FormGroup = new FormGroup({
    id: new FormControl(null),
    name: new FormControl(null, [Validators.required]),
    channelId: new FormControl(null, [Validators.required]),
    language: new FormControl(null, [Validators.required]),
    zoneId: new FormControl(null, [Validators.required]),
    priority: new FormControl(null, [Validators.required, Validators.min(0)]),
    fileId: new FormControl(null),
    url: new FormControl(null, [Validators.required]),
    startDate: new FormControl(null, [Validators.required]),
    endDate: new FormControl(null),
    active: new FormControl(null, [Validators.required]),
    labels: new FormControl(null)
  });

  bannerDetails: any;
  imageSrc: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: any;
  bannerImageAvailable: boolean = true;
  imgIsLoading: boolean = true;

  @Output() collapse: EventEmitter<boolean> = new EventEmitter<boolean>();

  selectBannerDetails$ = this._store.select(selectBannerInfo);
  selectChannels$ = this._store.select(selectChannels);
  selectZones$ = this._store.select(selectZones);
  selectLabels$ = this._store.select(selectLabels);
  selectLanguages$ = this._store.select(selectLanguages);
  selectLoading$ = this._store.select(selectLoading);
  selectRemoveBannerImageResponse$ = this._store.select(selectRemoveBannerImageResponse);
  selectSaveBannerResponse$ = this._store.select(selectSaveBannerResponse);
  selectUploadBannerImageResponse$ = this._store.select(selectUploadBannerImageResponse);

  constructor(private _dialog: MatDialog, private _store: Store<BannersState>) {}

  ngOnInit(): void {
    this.getReferenceData();
    this.addSubscription(this.selectBannerDetails$.subscribe(bannerDetails => {
      if(bannerDetails) {
        this.editMode = true;
        this.bannerDetails = bannerDetails;
        this.imageSrc = this.bannerDetails?.imgSrc;
        this.bannerImageAvailable = true;
        this.bannerForm.patchValue({
          ...this.bannerDetails,
          startDate: new Date(this.bannerDetails?.startDate?.split('T')[0]),
          endDate: new Date(this.bannerDetails?.endDate?.split('T')[0])
        });
      }
    }));

    this.addSubscription(this.selectRemoveBannerImageResponse$.subscribe(res => {
      if(this.editMode && this.selectedFile && this.bannerForm.value.fileId) {
        return;
    } else {
      if(res?.success === true) {
        this.selectedFile = null;
        this.imageSrc = '';
        this.bannerForm.patchValue({fileId: null});
      }
    }
    }));

    this.addSubscription(this.selectUploadBannerImageResponse$.subscribe(imgRes => {
      if(this.editMode && this.selectedFile) { 
        if(imgRes?.success){
          this.bannerForm.patchValue({fileId: imgRes.data.id});
          const payload = {...this.bannerForm.value};
          this.deleteNullProperties(payload);
          this._store.dispatch(saveBanner({payload: {...payload, fileId: imgRes.data.id}}));
        }
      }
    }));

    this.addSubscription(this.selectSaveBannerResponse$.subscribe(res => {
      if(this.editMode && this.selectedFile) {
        if(res?.success) {
          this.resetBannerForm();
          this.editMode = false;
          this.collapse.emit(true);
          this._store.dispatch(getBannersList({payload: undefined, blobPath: this.blobPath}));
        }
      } else {
        if(res?.success) {
          this.resetBannerForm();
          this.editMode = false;
          this.collapse.emit(true);
          this._store.dispatch(getBannersList({payload: undefined, blobPath: this.blobPath}));
        }
      }
    }));
  }

  getReferenceData(): void {
    const payload = {
      typeIds: [this.channelTypeId, this.zoneTypeId, this.labelTypeId, this.languageTypeId],
      pageSize: 500
    }
    
    this._store.dispatch(getReferenceData({payload}));
  }

  openFileInput(): void {
    const fileInputEl: HTMLElement = this.fileInput?.nativeElement;
    fileInputEl.click();
  }

  selectFile(event: any): void {
    const fileInput = event.target;
    this.selectedFile = fileInput.files[0];
    if (fileInput.files && fileInput.files[0]) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageSrc = e.target.result;
      };
      reader.readAsDataURL(file);
      fileInput.value = '';
    }
  }

  saveBanner(): void {
    if(this.bannerForm.valid) {
      const payload = {...this.bannerForm.value};
      this.deleteNullProperties(payload);
     
      //delete old image  
      if(this.editMode && this.selectedFile && this.bannerForm.value.fileId) {
          this._store.dispatch(removeBannerImage({payload}));
      }
      // upload new image and then save banner details
      if(this.editMode && this.selectedFile) {
        this._store.dispatch(uploadBannerImage({payload: this.selectedFile}));
      } else {
        this._store.dispatch(saveBanner({payload}));
      }
    }
  }

  onRemoveButton(): void {
    const dialogRef = this._dialog.open(ConfirmationDialogComponent, {
      data: {
        title: `Remove banner`,
        message: `Are you sure you want to proceed with this operation?`
      },
      panelClass: 'mobile-responsive-dialog',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
         this.removeBannerImage();
      }
    });
  }

  removeBannerImage(): void {
    if(this.editMode && this.bannerForm.value.fileId) {
    const payload = {
      blobIds: [this.bannerForm.value.fileId]
      }
      this._store.dispatch(removeBannerImage({payload}));
      } else {
        this.selectedFile = null;
        this.imageSrc = '';
      }
  }

  collapseForm(): void {
    if(this.editMode && this.bannerForm.value.fileId === null) {
      this._store.dispatch(getBannersList({payload: undefined, blobPath: this.blobPath}));
    }
    this.resetBannerForm();
    this.editMode = false;
  }

  resetBannerForm(): void {
    this.bannerForm.markAsPristine();
    this.bannerForm.reset();
    this.selectedFile = null;
    this.imageSrc = '';
    this.bannerImageAvailable = true;
    this.imgIsLoading = true;
  }

  handleImageLoading(): void {
    if(this.editMode) {
      this.imgIsLoading = false;
    }
  }

  handleImageError(): void {
    if(this.editMode) {
      this.bannerImageAvailable = false;
      this.imgIsLoading = false;
    }
  }

  displayImageChecker(): boolean {
    if((!this.editMode && !this.selectedFile) || (this.editMode && !this.selectedFile && !this.bannerImageAvailable)) {
      return true;
    }
    return false;
  }

  removeButtonDisplayChecker(): boolean {
    if((!this.editMode && this.selectedFile) || (this.editMode && (this.selectedFile || !this.imgIsLoading))) {
      return true;
    }
    return false;
  }

  deleteNullProperties(payload: any) {
    for (const property in payload) {
      if (payload[property] === null) {
        delete payload[property];
      }
    }
  }

  addSubscription(subscription: Subscription): void {
    this.subscriptions.push(subscription);
  }

  unsubscribeAll(): void {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions = [];
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
