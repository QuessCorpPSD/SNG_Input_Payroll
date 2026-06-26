import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialBatchCreationComponent } from './partial-batch-creation.component';

describe('PartialBatchCreationComponent', () => {
  let component: PartialBatchCreationComponent;
  let fixture: ComponentFixture<PartialBatchCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialBatchCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialBatchCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
