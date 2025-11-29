import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporatebankComponent } from './corporatebank.component';

describe('CorporatebankComponent', () => {
  let component: CorporatebankComponent;
  let fixture: ComponentFixture<CorporatebankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporatebankComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporatebankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
