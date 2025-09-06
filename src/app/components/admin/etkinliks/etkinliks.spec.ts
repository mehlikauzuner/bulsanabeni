import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Etkinliks } from './etkinliks';

describe('Etkinliks', () => {
  let component: Etkinliks;
  let fixture: ComponentFixture<Etkinliks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Etkinliks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Etkinliks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
