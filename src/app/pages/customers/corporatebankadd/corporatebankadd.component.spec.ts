import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorporatebankaddComponent } from './corporatebankadd.component';

describe('CorporatebankaddComponent', () => {
  let component: CorporatebankaddComponent;
  let fixture: ComponentFixture<CorporatebankaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorporatebankaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CorporatebankaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
