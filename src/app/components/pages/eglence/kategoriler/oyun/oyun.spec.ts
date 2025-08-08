import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Oyun } from './oyun';

describe('Oyun', () => {
  let component: Oyun;
  let fixture: ComponentFixture<Oyun>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Oyun]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Oyun);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
