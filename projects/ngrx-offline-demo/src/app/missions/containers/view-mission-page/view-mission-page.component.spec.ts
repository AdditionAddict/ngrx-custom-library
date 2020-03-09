import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewMissionPageComponent } from './view-mission-page.component';

describe('ViewMissionPageComponent', () => {
  let component: ViewMissionPageComponent;
  let fixture: ComponentFixture<ViewMissionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewMissionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewMissionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
