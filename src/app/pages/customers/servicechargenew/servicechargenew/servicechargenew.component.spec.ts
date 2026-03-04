import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServicechargenewComponent } from './servicechargenew.component';

describe('ServicechargenewComponent', () => {
  let component: ServicechargenewComponent;
  let fixture: ComponentFixture<ServicechargenewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicechargenewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServicechargenewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
