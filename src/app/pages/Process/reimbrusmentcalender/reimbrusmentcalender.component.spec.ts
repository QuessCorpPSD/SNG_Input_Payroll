import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbrusmentcalenderComponent } from './reimbrusmentcalender.component';

describe('ReimbrusmentcalenderComponent', () => {
  let component: ReimbrusmentcalenderComponent;
  let fixture: ComponentFixture<ReimbrusmentcalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReimbrusmentcalenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReimbrusmentcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
