import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewBodyPageComponent } from './view-body-page.component';

describe('ViewBodyPageComponent', () => {
  let component: ViewBodyPageComponent;
  let fixture: ComponentFixture<ViewBodyPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewBodyPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewBodyPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
