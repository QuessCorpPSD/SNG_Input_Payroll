import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayfrequencyCopyComponent } from './payfrequency-copy.component';

describe('PayfrequencyCopyComponent', () => {
  let component: PayfrequencyCopyComponent;
  let fixture: ComponentFixture<PayfrequencyCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayfrequencyCopyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayfrequencyCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
