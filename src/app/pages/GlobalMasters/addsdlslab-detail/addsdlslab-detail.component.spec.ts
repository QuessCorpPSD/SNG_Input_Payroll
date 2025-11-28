import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ADDSDLslabDetailComponent } from './addsdlslab-detail.component';

describe('ADDSDLslabDetailComponent', () => {
  let component: ADDSDLslabDetailComponent;
  let fixture: ComponentFixture<ADDSDLslabDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ADDSDLslabDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ADDSDLslabDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
