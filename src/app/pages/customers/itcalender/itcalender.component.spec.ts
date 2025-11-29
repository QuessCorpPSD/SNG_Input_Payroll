import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITcalenderComponent } from './itcalender.component';

describe('ITcalenderComponent', () => {
  let component: ITcalenderComponent;
  let fixture: ComponentFixture<ITcalenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITcalenderComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ITcalenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
