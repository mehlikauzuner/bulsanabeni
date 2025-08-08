import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Eglence } from './eglence';

describe('Eglence', () => {
  let component: Eglence;
  let fixture: ComponentFixture<Eglence>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Eglence]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Eglence);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
