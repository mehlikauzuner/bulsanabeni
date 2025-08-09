import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Yurtdisi } from './yurtdisi';

describe('Yurtdisi', () => {
  let component: Yurtdisi;
  let fixture: ComponentFixture<Yurtdisi>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Yurtdisi]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Yurtdisi);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
