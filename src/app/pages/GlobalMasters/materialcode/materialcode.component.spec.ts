import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MaterialcodeComponent } from './materialcode.component';

describe('MaterialcodeComponent', () => {
  let component: MaterialcodeComponent;
  let fixture: ComponentFixture<MaterialcodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialcodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MaterialcodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
