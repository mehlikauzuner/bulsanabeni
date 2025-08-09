import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Tasarim } from './tasarim';

describe('Tasarim', () => {
  let component: Tasarim;
  let fixture: ComponentFixture<Tasarim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Tasarim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Tasarim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
