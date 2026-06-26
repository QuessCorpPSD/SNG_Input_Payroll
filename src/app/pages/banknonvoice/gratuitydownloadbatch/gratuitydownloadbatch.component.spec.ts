import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GratuitydownloadbatchComponent } from './gratuitydownloadbatch.component';

describe('GratuitydownloadbatchComponent', () => {
  let component: GratuitydownloadbatchComponent;
  let fixture: ComponentFixture<GratuitydownloadbatchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GratuitydownloadbatchComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GratuitydownloadbatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
