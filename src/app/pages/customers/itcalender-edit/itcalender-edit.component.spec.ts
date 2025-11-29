import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITcalenderEditComponent } from './itcalender-edit.component';

describe('ITcalenderEditComponent', () => {
  let component: ITcalenderEditComponent;
  let fixture: ComponentFixture<ITcalenderEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITcalenderEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ITcalenderEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
