import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Yarismalar } from './yarismalar';

describe('Yarismalar', () => {
  let component: Yarismalar;
  let fixture: ComponentFixture<Yarismalar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Yarismalar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Yarismalar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
