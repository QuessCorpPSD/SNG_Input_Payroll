import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayregisteruploadComponent } from './payregisterupload.component';

describe('PayregisteruploadComponent', () => {
  let component: PayregisteruploadComponent;
  let fixture: ComponentFixture<PayregisteruploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayregisteruploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayregisteruploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
