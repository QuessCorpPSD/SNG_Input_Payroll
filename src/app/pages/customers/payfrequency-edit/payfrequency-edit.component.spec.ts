import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayfrequencyEditComponent } from './payfrequency-edit.component';

describe('PayfrequencyEditComponent', () => {
  let component: PayfrequencyEditComponent;
  let fixture: ComponentFixture<PayfrequencyEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayfrequencyEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayfrequencyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
