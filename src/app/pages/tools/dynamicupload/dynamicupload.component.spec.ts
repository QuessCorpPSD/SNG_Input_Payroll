import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicuploadComponent } from './dynamicupload.component';

describe('DynamicuploadComponent', () => {
  let component: DynamicuploadComponent;
  let fixture: ComponentFixture<DynamicuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicuploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
