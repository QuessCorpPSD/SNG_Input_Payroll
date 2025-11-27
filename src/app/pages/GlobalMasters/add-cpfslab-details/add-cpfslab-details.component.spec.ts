import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCPFslabDetailsComponent } from './add-cpfslab-details.component';

describe('AddCPFslabDetailsComponent', () => {
  let component: AddCPFslabDetailsComponent;
  let fixture: ComponentFixture<AddCPFslabDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddCPFslabDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddCPFslabDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
