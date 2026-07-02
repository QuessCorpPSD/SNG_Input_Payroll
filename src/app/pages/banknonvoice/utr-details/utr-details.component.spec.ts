import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UtrDetailsComponent } from './utr-details.component';

describe('UtrDetailsComponent', () => {
  let component: UtrDetailsComponent;
  let fixture: ComponentFixture<UtrDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UtrDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UtrDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
