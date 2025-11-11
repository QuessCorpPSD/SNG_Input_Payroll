import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DBTholdemployeesalaryComponent } from './dbtholdemployeesalary.component';

describe('DBTholdemployeesalaryComponent', () => {
  let component: DBTholdemployeesalaryComponent;
  let fixture: ComponentFixture<DBTholdemployeesalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DBTholdemployeesalaryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DBTholdemployeesalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
