import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayfrequencyComponent } from './payfrequency.component';

describe('PayfrequencyComponent', () => {
  let component: PayfrequencyComponent;
  let fixture: ComponentFixture<PayfrequencyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayfrequencyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayfrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
