import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IsActiveComponent } from './is-active.component';

describe('IsActiveComponent', () => {
  let component: IsActiveComponent;
  let fixture: ComponentFixture<IsActiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IsActiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IsActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
