import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayprocesstypeComponent } from './payprocesstype.component';

describe('PayprocesstypeComponent', () => {
  let component: PayprocesstypeComponent;
  let fixture: ComponentFixture<PayprocesstypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayprocesstypeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayprocesstypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
