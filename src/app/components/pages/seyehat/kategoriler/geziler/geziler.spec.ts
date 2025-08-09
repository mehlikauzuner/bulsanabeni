import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Geziler } from './geziler';

describe('Geziler', () => {
  let component: Geziler;
  let fixture: ComponentFixture<Geziler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Geziler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Geziler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
