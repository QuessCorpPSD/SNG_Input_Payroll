import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SgpayregisterComponent } from './sgpayregister.component';

describe('SgpayregisterComponent', () => {
  let component: SgpayregisterComponent;
  let fixture: ComponentFixture<SgpayregisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SgpayregisterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SgpayregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
