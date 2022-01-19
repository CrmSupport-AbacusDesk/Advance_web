import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyScanReportComponent } from './daily-scan-report.component';

describe('DailyScanReportComponent', () => {
  let component: DailyScanReportComponent;
  let fixture: ComponentFixture<DailyScanReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyScanReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyScanReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
