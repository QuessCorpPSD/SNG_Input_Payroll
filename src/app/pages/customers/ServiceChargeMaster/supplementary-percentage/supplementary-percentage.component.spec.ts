import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryPercentageComponent } from './supplementary-percentage.component';

describe('SupplementaryPercentageComponent', () => {
  let component: SupplementaryPercentageComponent;
  let fixture: ComponentFixture<SupplementaryPercentageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplementaryPercentageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplementaryPercentageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
