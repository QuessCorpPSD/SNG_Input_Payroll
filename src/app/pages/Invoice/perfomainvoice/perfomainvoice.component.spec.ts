import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfomainvoiceComponent } from './perfomainvoice.component';

describe('PerfomainvoiceComponent', () => {
  let component: PerfomainvoiceComponent;
  let fixture: ComponentFixture<PerfomainvoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfomainvoiceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerfomainvoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
