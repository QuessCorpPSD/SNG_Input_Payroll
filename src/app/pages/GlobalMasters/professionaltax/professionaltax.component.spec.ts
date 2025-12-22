import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionaltaxComponent } from './professionaltax.component';

describe('ProfessionaltaxComponent', () => {
  let component: ProfessionaltaxComponent;
  let fixture: ComponentFixture<ProfessionaltaxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionaltaxComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfessionaltaxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
