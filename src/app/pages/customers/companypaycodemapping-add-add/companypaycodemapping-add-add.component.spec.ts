import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanypaycodemappingAddAddComponent } from './companypaycodemapping-add-add.component';

describe('CompanypaycodemappingAddAddComponent', () => {
  let component: CompanypaycodemappingAddAddComponent;
  let fixture: ComponentFixture<CompanypaycodemappingAddAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanypaycodemappingAddAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CompanypaycodemappingAddAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
