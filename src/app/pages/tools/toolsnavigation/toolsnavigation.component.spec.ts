import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolsnavigationComponent } from './toolsnavigation.component';

describe('ToolsnavigationComponent', () => {
  let component: ToolsnavigationComponent;
  let fixture: ComponentFixture<ToolsnavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ToolsnavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ToolsnavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
