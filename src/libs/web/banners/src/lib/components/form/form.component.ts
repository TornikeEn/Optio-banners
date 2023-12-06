import { Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from 'src/libs/web/shared/src/components/confirmation-dialog.component';

import { BannersState } from '../../store/state';

@Component({
  selector: 'app-banner-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})

export class BannerFormComponent implements OnChanges, OnDestroy {  
  @Input() blobPath: string = '';

  @Input() editMode: boolean = false;

  @Input() channels!: any[];
  @Input() zones!: any[];
  @Input() labels!: any[];
  @Input() languages!: any[];

  @Input() loading: any;

  @Input() bannerDetails: any;
  @Input() removeBannerImageResponse: any;
  @Input() saveBannerResponse: any;
  @Input() uploadBannerImageResponse: any;
  
  @Output() collapse: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Output() fileIdChanged: EventEmitter<any> = new EventEmitter<any>();
  
  @Output() removeImageClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() oldImageRemove: EventEmitter<any> = new EventEmitter<any>();
  @Output() newImageUpload: EventEmitter<any> = new EventEmitter<any>();
  @Output() saveBannerRequest: EventEmitter<any> = new EventEmitter<any>();

  subscriptions: any[] = [];

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

  imageSrc: string = '';
  @ViewChild('fileInput') fileInput!: ElementRef;
  selectedFile: any;
  bannerImageAvailable: boolean = true;
  imgIsLoading: boolean = true;

  constructor(private _dialog: MatDialog, private _store: Store<BannersState>) {
    this.addSubscription(
      this.bannerForm.get('fileId')?.valueChanges.subscribe((fileId) => {
      this.fileIdChanged.emit(fileId);
      })
    )
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['bannerDetails']) {
      this.editMode = true;
      this.imageSrc = this.bannerDetails?.imgSrc;
      this.bannerImageAvailable = true;
      this.bannerForm.patchValue({
        ...this.bannerDetails,
        startDate: new Date(this.bannerDetails?.startDate?.split('T')[0]),
        endDate: new Date(this.bannerDetails?.endDate?.split('T')[0])
      });
    }

    if(changes['removeBannerImageResponse']) {
      if(this.editMode && this.selectedFile && this.bannerForm.value.fileId) {
        return;
      } else {
        if(this.removeBannerImageResponse?.success === true) {
          this.selectedFile = null;
          this.imageSrc = '';
          this.bannerForm.patchValue({fileId: null});
        }
      }
    }

    if(changes['saveBannerResponse']) {
      if(this.editMode && this.selectedFile) {
        if(this.saveBannerResponse?.success) {
          this.resetForm();
          this.editMode = false;
          this.collapse.emit(true);
          }
        } else {
          if(this.saveBannerResponse?.success) {
            this.resetForm();
            this.editMode = false;
            this.collapse.emit(true);
          }
        }
      }

    if(changes['uploadBannerImageResponse']) {
      if(this.editMode && this.selectedFile) { 
        if(this.uploadBannerImageResponse?.success){
          this.bannerForm.patchValue({fileId: this.uploadBannerImageResponse.data.id});
          const payload = {...this.bannerForm.value};
          this.deleteNullProperties(payload);
          this.saveBannerRequest.emit({...payload, fileId: this.uploadBannerImageResponse.data.id});
        }
      } else {
        if(this.uploadBannerImageResponse?.success){
          this.bannerForm.patchValue({fileId: this.uploadBannerImageResponse.data.id});
          const payload = {...this.bannerForm.value};
          this.deleteNullProperties(payload);
          if(this.bannerForm.valid) {
            this.saveBannerRequest.emit({...payload, fileId: this.uploadBannerImageResponse.data.id});
          }
        }
      }
      }
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
          this.oldImageRemove.emit(payload);
      }
      // upload new image and then save banner details
      if(this.selectedFile) {
          this.newImageUpload.emit(this.selectedFile);
        return;
      }
      if(this.editMode && this.bannerForm.valid) {
        this.saveBannerRequest.emit(payload)
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
         this.removeClickEventHandler();
      }
    });
  }

  removeClickEventHandler(): void {
    if(this.editMode && this.bannerForm.value.fileId) {
      this.removeImageClick.emit();
      } else {
        this.selectedFile = null;
        this.imageSrc = '';
      }
  }

  collapseForm(): void {
    this.resetForm();
  }

  resetForm(): void {
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

  addSubscription(subscription: Subscription | undefined): void {
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
