import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Anasayfa } from './anasayfa';

describe('Anasayfa', () => {
  let component: Anasayfa;
  let fixture: ComponentFixture<Anasayfa>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Anasayfa]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Anasayfa);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
