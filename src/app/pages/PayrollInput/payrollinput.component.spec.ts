import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayrollinputComponent } from './payrollinput.component';

describe('PayrollinputComponent', () => {
  let component: PayrollinputComponent;
  let fixture: ComponentFixture<PayrollinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PayrollinputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PayrollinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
