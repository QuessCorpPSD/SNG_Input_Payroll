import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeavemasterComponent } from './leavemaster.component';

describe('LeavemasterComponent', () => {
  let component: LeavemasterComponent;
  let fixture: ComponentFixture<LeavemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeavemasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeavemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
