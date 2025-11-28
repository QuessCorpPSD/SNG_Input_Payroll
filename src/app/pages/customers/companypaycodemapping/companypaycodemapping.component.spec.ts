import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypaycodemappingComponent } from './companypaycodemapping.component';

describe('CompanypaycodemappingComponent', () => {
  let component: CompanypaycodemappingComponent;
  let fixture: ComponentFixture<CompanypaycodemappingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanypaycodemappingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanypaycodemappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
