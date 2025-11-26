import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayProcessComponent } from './pay-process.component';

describe('PayProcessComponent', () => {
  let component: PayProcessComponent;
  let fixture: ComponentFixture<PayProcessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayProcessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
