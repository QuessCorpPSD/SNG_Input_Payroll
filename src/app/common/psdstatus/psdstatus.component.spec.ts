import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsdstatusComponent } from './psdstatus.component';

describe('PsdstatusComponent', () => {
  let component: PsdstatusComponent;
  let fixture: ComponentFixture<PsdstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsdstatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PsdstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
