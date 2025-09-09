import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyallComponent } from './companyall.component';

describe('CompanyallComponent', () => {
  let component: CompanyallComponent;
  let fixture: ComponentFixture<CompanyallComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyallComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
