import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupplementaryFixedComponent } from './supplementary-fixed.component';

describe('SupplementaryFixedComponent', () => {
  let component: SupplementaryFixedComponent;
  let fixture: ComponentFixture<SupplementaryFixedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupplementaryFixedComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupplementaryFixedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
