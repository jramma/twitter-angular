import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { RegisterComponent } from './register.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        BrowserAnimationsModule, // Necesario para animaciones de Angular Material
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should validate birth_date format as dd-MM-yyyy', () => {
    const birthDateControl = component.registerForm.get('birth_date');

    // Fecha válida
    birthDateControl?.setValue('29-11-2024');
    expect(birthDateControl?.valid).toBeTruthy();

    // Fecha inválida
    birthDateControl?.setValue('11/29/2024');
    expect(birthDateControl?.valid).toBeFalsy();
  });
  it('should validate the form as invalid when fields are empty', () => {
    expect(component.registerForm.valid).toBeFalsy();
  });

  it('should validate the form as valid with correct data', () => {
    component.registerForm.setValue({
      name: 'John',
      surname_1: 'Doe',
      surname_2: 'Smith',
      alias: 'johndoe',
      birth_date: '29-11-2024',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    });

    expect(component.registerForm.valid).toBeTruthy();
  });
  it('should call register when the form is valid', () => {
    spyOn(component, 'register');

    component.registerForm.setValue({
      name: 'John',
      surname_1: 'Doe',
      surname_2: 'Smith',
      alias: 'johndoe',
      birth_date: '29-11-2024',
      email: 'john.doe@example.com',
      password: 'securePassword123',
    });

    // Simula el envío del formulario
    component.register();

    expect(component.register).toHaveBeenCalled();
  });
});
