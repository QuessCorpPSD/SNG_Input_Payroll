import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypaycodemappingAddComponent } from './companypaycodemapping-add.component';

describe('CompanypaycodemappingAddComponent', () => {
  let component: CompanypaycodemappingAddComponent;
  let fixture: ComponentFixture<CompanypaycodemappingAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanypaycodemappingAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanypaycodemappingAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
