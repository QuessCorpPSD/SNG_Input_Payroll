import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetpayreportComponent } from './netpayreport.component';

describe('NetpayreportComponent', () => {
  let component: NetpayreportComponent;
  let fixture: ComponentFixture<NetpayreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetpayreportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetpayreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
