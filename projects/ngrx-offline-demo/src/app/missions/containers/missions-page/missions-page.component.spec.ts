import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionsPageComponent } from './missions-page.component';

describe('MissionsPageComponent', () => {
  let component: MissionsPageComponent;
  let fixture: ComponentFixture<MissionsPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MissionsPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
