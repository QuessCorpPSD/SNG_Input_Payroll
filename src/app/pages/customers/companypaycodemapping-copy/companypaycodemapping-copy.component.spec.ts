import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypaycodemappingCopyComponent } from './companypaycodemapping-copy.component';

describe('CompanypaycodemappingCopyComponent', () => {
  let component: CompanypaycodemappingCopyComponent;
  let fixture: ComponentFixture<CompanypaycodemappingCopyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanypaycodemappingCopyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanypaycodemappingCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
