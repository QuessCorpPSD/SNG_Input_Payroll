import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericUploadComponent } from './generic-upload.component';

describe('GenericUploadComponent', () => {
  let component: GenericUploadComponent;
  let fixture: ComponentFixture<GenericUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericUploadComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
