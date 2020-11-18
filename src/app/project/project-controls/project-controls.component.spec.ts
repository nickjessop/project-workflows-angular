import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectControlsComponent } from './project-controls.component';

describe('ProjectControlsComponent', () => {
  let component: ProjectControlsComponent;
  let fixture: ComponentFixture<ProjectControlsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectControlsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectControlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
