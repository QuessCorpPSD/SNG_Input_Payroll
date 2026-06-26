import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuityBatchGenerationComponent } from './gratuity-batch-generation.component';

describe('GratuityBatchGenerationComponent', () => {
  let component: GratuityBatchGenerationComponent;
  let fixture: ComponentFixture<GratuityBatchGenerationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GratuityBatchGenerationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GratuityBatchGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
