import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NewCustomerPage } from './new-customer.page';

describe('NewCustomerPage', () => {
  let component: NewCustomerPage;
  let fixture: ComponentFixture<NewCustomerPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewCustomerPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
