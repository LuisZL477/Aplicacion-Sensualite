import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagoExitosoPage } from './pago-exitoso.page';

describe('PagoExitosoPage', () => {
  let component: PagoExitosoPage;
  let fixture: ComponentFixture<PagoExitosoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagoExitosoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
