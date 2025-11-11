import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldReleaseRequestComponent } from './hold-release-request.component';

describe('HoldReleaseRequestComponent', () => {
  let component: HoldReleaseRequestComponent;
  let fixture: ComponentFixture<HoldReleaseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldReleaseRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HoldReleaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
