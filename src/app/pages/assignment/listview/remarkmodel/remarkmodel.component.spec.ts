import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RemarkmodelComponent } from './remarkmodel.component';

describe('RemarkmodelComponent', () => {
  let component: RemarkmodelComponent;
  let fixture: ComponentFixture<RemarkmodelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RemarkmodelComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RemarkmodelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
