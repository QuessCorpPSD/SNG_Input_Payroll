import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditnotebalancereportComponent } from './creditnotebalancereport.component';

describe('CreditnotebalancereportComponent', () => {
  let component: CreditnotebalancereportComponent;
  let fixture: ComponentFixture<CreditnotebalancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditnotebalancereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditnotebalancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
