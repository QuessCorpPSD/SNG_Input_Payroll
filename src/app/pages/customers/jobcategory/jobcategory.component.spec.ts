import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobcategoryComponent } from './jobcategory.component';

describe('JobcategoryComponent', () => {
  let component: JobcategoryComponent;
  let fixture: ComponentFixture<JobcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobcategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(JobcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
