import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusflushComponent } from './bonusflush.component';

describe('BonusflushComponent', () => {
  let component: BonusflushComponent;
  let fixture: ComponentFixture<BonusflushComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusflushComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusflushComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
