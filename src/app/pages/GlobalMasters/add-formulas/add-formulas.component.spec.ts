import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormulasComponent } from './add-formulas.component';

describe('AddFormulasComponent', () => {
  let component: AddFormulasComponent;
  let fixture: ComponentFixture<AddFormulasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddFormulasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddFormulasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
