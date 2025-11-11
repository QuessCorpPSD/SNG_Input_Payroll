import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReprocessComponent } from './reprocess.component';

describe('ReprocessComponent', () => {
  let component: ReprocessComponent;
  let fixture: ComponentFixture<ReprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReprocessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
