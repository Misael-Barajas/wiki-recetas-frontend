import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRecetas } from './admin-recetas';

describe('AdminRecetas', () => {
  let component: AdminRecetas;
  let fixture: ComponentFixture<AdminRecetas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminRecetas],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminRecetas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
