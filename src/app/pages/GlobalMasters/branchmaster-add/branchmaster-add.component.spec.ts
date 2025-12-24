import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchmasterAddComponent } from './branchmaster-add.component';

describe('BranchmasterAddComponent', () => {
  let component: BranchmasterAddComponent;
  let fixture: ComponentFixture<BranchmasterAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BranchmasterAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BranchmasterAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
