import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ilan } from './ilan';

describe('Ilan', () => {
  let component: Ilan;
  let fixture: ComponentFixture<Ilan>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ilan]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Ilan);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
