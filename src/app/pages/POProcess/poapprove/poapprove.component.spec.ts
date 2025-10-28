import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POApproveComponent } from './poapprove.component';

describe('POApproveComponent', () => {
  let component: POApproveComponent;
  let fixture: ComponentFixture<POApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POApproveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
