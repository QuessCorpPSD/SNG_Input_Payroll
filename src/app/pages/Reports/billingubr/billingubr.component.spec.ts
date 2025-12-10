import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingubrComponent } from './billingubr.component';

describe('BillingubrComponent', () => {
  let component: BillingubrComponent;
  let fixture: ComponentFixture<BillingubrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BillingubrComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingubrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
