import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermhirejobsubcategoryComponent } from './permhirejobsubcategory.component';

describe('PermhirejobsubcategoryComponent', () => {
  let component: PermhirejobsubcategoryComponent;
  let fixture: ComponentFixture<PermhirejobsubcategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermhirejobsubcategoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermhirejobsubcategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
