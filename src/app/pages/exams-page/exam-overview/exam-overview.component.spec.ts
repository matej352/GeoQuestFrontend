import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamOverviewComponent } from './exam-overview.component';

describe('ExamOverviewComponent', () => {
  let component: ExamOverviewComponent;
  let fixture: ComponentFixture<ExamOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamOverviewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExamOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
