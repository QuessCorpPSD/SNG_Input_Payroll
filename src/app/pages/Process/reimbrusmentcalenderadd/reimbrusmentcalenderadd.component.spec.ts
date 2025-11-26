import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbrusmentcalenderaddComponent } from './reimbrusmentcalenderadd.component';

describe('ReimbrusmentcalenderaddComponent', () => {
  let component: ReimbrusmentcalenderaddComponent;
  let fixture: ComponentFixture<ReimbrusmentcalenderaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbrusmentcalenderaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReimbrusmentcalenderaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
