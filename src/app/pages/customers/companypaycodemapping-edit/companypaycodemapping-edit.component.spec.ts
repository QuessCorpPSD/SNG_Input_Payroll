import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypaycodemappingEditComponent } from './companypaycodemapping-edit.component';

describe('CompanypaycodemappingEditComponent', () => {
  let component: CompanypaycodemappingEditComponent;
  let fixture: ComponentFixture<CompanypaycodemappingEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanypaycodemappingEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanypaycodemappingEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
