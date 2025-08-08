import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trekking } from './trekking';

describe('Trekking', () => {
  let component: Trekking;
  let fixture: ComponentFixture<Trekking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trekking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Trekking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
