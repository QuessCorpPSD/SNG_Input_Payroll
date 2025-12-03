import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SourcingFeeComponent } from './sourcing-fee.component';

describe('SourcingFeeComponent', () => {
  let component: SourcingFeeComponent;
  let fixture: ComponentFixture<SourcingFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SourcingFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SourcingFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
