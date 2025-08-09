import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Enstruman } from './enstruman';

describe('Enstruman', () => {
  let component: Enstruman;
  let fixture: ComponentFixture<Enstruman>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Enstruman]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Enstruman);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
