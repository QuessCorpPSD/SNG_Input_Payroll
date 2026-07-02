import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankneftcultureComponent } from './bankneftculture.component';

describe('BankneftcultureComponent', () => {
  let component: BankneftcultureComponent;
  let fixture: ComponentFixture<BankneftcultureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankneftcultureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankneftcultureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
