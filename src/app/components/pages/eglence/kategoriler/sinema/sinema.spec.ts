import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sinema } from './sinema';

describe('Sinema', () => {
  let component: Sinema;
  let fixture: ComponentFixture<Sinema>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Sinema]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Sinema);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
