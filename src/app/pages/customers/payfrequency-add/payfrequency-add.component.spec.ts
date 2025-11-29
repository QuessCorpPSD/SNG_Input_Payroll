import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayfrequencyAddComponent } from './payfrequency-add.component';

describe('PayfrequencyAddComponent', () => {
  let component: PayfrequencyAddComponent;
  let fixture: ComponentFixture<PayfrequencyAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayfrequencyAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayfrequencyAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
