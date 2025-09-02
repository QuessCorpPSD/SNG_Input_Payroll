import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SopformComponent } from './sopform.component';

describe('SopformComponent', () => {
  let component: SopformComponent;
  let fixture: ComponentFixture<SopformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SopformComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SopformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
