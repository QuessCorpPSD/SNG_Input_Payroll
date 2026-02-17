import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchcreationprocessComponent } from './batchcreationprocess.component';

describe('BatchcreationprocessComponent', () => {
  let component: BatchcreationprocessComponent;
  let fixture: ComponentFixture<BatchcreationprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchcreationprocessComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BatchcreationprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
