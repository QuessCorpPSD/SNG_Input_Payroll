import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildreneducationallowanceComponent } from './childreneducationallowance.component';

describe('ChildreneducationallowanceComponent', () => {
  let component: ChildreneducationallowanceComponent;
  let fixture: ComponentFixture<ChildreneducationallowanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChildreneducationallowanceComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChildreneducationallowanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
