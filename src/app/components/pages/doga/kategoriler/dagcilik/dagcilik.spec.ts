import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dagcilik } from './dagcilik';

describe('Dagcilik', () => {
  let component: Dagcilik;
  let fixture: ComponentFixture<Dagcilik>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dagcilik]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dagcilik);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
