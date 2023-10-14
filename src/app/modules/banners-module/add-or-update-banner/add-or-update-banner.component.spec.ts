import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOrUpdateBannerComponent } from './add-or-update-banner.component';

describe('AddOrUpdateBannerComponent', () => {
  let component: AddOrUpdateBannerComponent;
  let fixture: ComponentFixture<AddOrUpdateBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddOrUpdateBannerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddOrUpdateBannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
