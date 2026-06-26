import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericuploadComponent } from './genericupload.component';

describe('GenericuploadComponent', () => {
  let component: GenericuploadComponent;
  let fixture: ComponentFixture<GenericuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenericuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenericuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
