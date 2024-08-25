import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoCanceladoPage } from './pago-cancelado.page';

describe('PagoCanceladoPage', () => {
  let component: PagoCanceladoPage;
  let fixture: ComponentFixture<PagoCanceladoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoCanceladoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
