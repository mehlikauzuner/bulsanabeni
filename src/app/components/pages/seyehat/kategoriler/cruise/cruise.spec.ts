import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Cruise } from './cruise';

describe('Cruise', () => {
  let component: Cruise;
  let fixture: ComponentFixture<Cruise>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Cruise]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Cruise);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
