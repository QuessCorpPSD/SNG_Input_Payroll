import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialHoldComponent } from './partial-hold.component';

describe('PartialHoldComponent', () => {
  let component: PartialHoldComponent;
  let fixture: ComponentFixture<PartialHoldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialHoldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialHoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
