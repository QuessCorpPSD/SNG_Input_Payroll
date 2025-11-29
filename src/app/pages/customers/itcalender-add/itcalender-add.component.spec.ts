import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITcalenderAddComponent } from './itcalender-add.component';

describe('ITcalenderAddComponent', () => {
  let component: ITcalenderAddComponent;
  let fixture: ComponentFixture<ITcalenderAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITcalenderAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ITcalenderAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
