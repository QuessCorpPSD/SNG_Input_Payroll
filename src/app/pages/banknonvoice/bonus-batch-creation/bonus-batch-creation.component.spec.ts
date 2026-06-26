import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusBatchCreationComponent } from './bonus-batch-creation.component';

describe('BonusBatchCreationComponent', () => {
  let component: BonusBatchCreationComponent;
  let fixture: ComponentFixture<BonusBatchCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonusBatchCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonusBatchCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
