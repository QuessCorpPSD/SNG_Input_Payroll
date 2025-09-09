import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapnameComponent } from './mapname.component';

describe('MapnameComponent', () => {
  let component: MapnameComponent;
  let fixture: ComponentFixture<MapnameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapnameComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapnameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
