import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Halkoyunlari } from './halkoyunlari';

describe('Halkoyunlari', () => {
  let component: Halkoyunlari;
  let fixture: ComponentFixture<Halkoyunlari>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Halkoyunlari]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Halkoyunlari);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
