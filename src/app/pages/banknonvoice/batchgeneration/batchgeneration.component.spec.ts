import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchgenerationComponent } from './batchgeneration.component';

describe('BatchgenerationComponent', () => {
  let component: BatchgenerationComponent;
  let fixture: ComponentFixture<BatchgenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchgenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchgenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
