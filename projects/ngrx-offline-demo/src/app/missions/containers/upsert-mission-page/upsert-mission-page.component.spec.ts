import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpsertMissionPageComponent } from './upsert-mission-page.component';

describe('UpsertMissionPageComponent', () => {
  let component: UpsertMissionPageComponent;
  let fixture: ComponentFixture<UpsertMissionPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertMissionPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpsertMissionPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
