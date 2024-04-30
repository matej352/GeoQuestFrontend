import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamInstanceComponent } from './exam-instance.component';

describe('ExamInstanceComponent', () => {
  let component: ExamInstanceComponent;
  let fixture: ComponentFixture<ExamInstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamInstanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
