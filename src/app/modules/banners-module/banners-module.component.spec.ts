import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannersModuleComponent } from './banners-module.component';


describe('BannersModuleComponent', () => {
  let component: BannersModuleComponent;
  let fixture: ComponentFixture<BannersModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BannersModuleComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BannersModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
