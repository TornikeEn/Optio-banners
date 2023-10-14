import { Component, ElementRef, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatDialog } from '@angular/material/dialog';

import { BannersApiService } from 'src/app/shared/httpClient/api/banners-api.service';
import { BannersService } from '../banners.service';

import { ConfirmationDialogComponent } from 'src/app/shared/components/confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-add-or-update-banner',
  templateUrl: './add-or-update-banner.component.html',
  styleUrls: ['./add-or-update-banner.component.scss']
})

export class AddOrUpdateBannerComponent implements OnInit, OnDestroy {  
  channelTypeId: string = '1600';
  zoneTypeId: string = '1700';
  labelTypeId: string = '1900';
  languageTypeId: string = '2900';
  channels: any[] = [];
  zones: any[] = [];
  labels: any[] = [];
  languages: any[] = [];
  editMode: boolean = false;

  subscriptions: Subscription[] = [];
  httpRequestSub!: Subscription;

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

  constructor(private _bannersApiService: BannersApiService, private _bannersService: BannersService, private _dialog: MatDialog) {}

  ngOnInit(): void {
    this.getReferenceData();
    this.addSubscription(this._bannersService.bannerDetails$.subscribe(bannerDetails => {
      this.editMode = true;
      this.bannerDetails = bannerDetails;
      this.imageSrc = this.bannerDetails.imgSrc;
      this.bannerForm.patchValue({
        ...this.bannerDetails,
        startDate: new Date(this.bannerDetails.startDate?.split('T')[0]),
        endDate: new Date(this.bannerDetails.endDate?.split('T')[0])
      });
    }));
  }

  getReferenceData(): void {
    const payload = {
      typeIds: [this.channelTypeId, this.zoneTypeId, this.labelTypeId, this.languageTypeId],
      pageSize: 500
    }

    this.httpRequestSub = this._bannersApiService.getReferenceData(payload).subscribe((res) => {
      if(res.success) {
        res.data.entities.forEach((element: any) => {
          if(element.typeId === this.channelTypeId) {
            this.channels.push(element);
          }
          if(element.typeId === this.zoneTypeId) {
            this.zones.push(element);
          }
          if(element.typeId === this.labelTypeId) {
            this.labels.push(element);
          }
          if(element.typeId === this.languageTypeId) {
            this.languages.push(element);
          }
        });
      }
    })
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

      for (const property in payload) {
        if (payload[property] === null) {
          delete payload[property];
        }
      }
      //delete old image  
      if(this.editMode && this.selectedFile && this.bannerForm.value.fileId) {
          const payload = {
            blobIds: [this.bannerForm.value.fileId],
          };
          this._bannersApiService.removeBannerImage(payload).subscribe();
      }
      // upload new image and then save banner details
      if(this.editMode && this.selectedFile) {
        this.httpRequestSub = this._bannersApiService.uploadBannerImage(this.selectedFile).subscribe(imgRes => {
          if(imgRes.success){
            this.bannerForm.patchValue({fileId: imgRes.data.id})
            this.httpRequestSub = this._bannersApiService.saveBanner({...payload, fileId: imgRes.data.id}).subscribe(res =>{
              if(res.success) {
                this.resetBannerForm();
                this.editMode = false;
                this.collapse.emit(true);
                this._bannersService.updateBannersList$.next(true);
              }
            });
          }
        }); 
      } else {
        this.httpRequestSub = this._bannersApiService.saveBanner(payload).subscribe(res =>{
          if(res.success) {
            this.resetBannerForm();
            this.editMode = false;
            this.collapse.emit(true);
            this._bannersService.updateBannersList$.next(true);
          }
        });
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
      this.httpRequestSub = this._bannersApiService.removeBannerImage(payload).subscribe(res => {
          if(res.success){
            this.selectedFile = null;
            this.imageSrc = '';
            this.bannerForm.patchValue({fileId: null});
          }
        });
      } else {
        this.selectedFile = null;
        this.imageSrc = '';
      }
  }

  collapseForm(): void {
    if(this.editMode && this.bannerForm.value.fileId === null) {
      this._bannersService.updateBannersList$.next(true);
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
