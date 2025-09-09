import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InputmenuComponent } from './inputmenu.component';

describe('InputmenuComponent', () => {
  let component: InputmenuComponent;
  let fixture: ComponentFixture<InputmenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InputmenuComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InputmenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
