import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sanat } from './sanat';

describe('Sanat', () => {
  let component: Sanat;
  let fixture: ComponentFixture<Sanat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sanat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sanat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
