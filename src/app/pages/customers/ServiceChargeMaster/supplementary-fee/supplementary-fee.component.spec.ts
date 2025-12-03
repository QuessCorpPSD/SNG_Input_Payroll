import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryFeeComponent } from './supplementary-fee.component';

describe('SupplementaryFeeComponent', () => {
  let component: SupplementaryFeeComponent;
  let fixture: ComponentFixture<SupplementaryFeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplementaryFeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplementaryFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
