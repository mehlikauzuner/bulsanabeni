import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fotograf } from './fotograf';

describe('Fotograf', () => {
  let component: Fotograf;
  let fixture: ComponentFixture<Fotograf>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fotograf]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fotograf);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
