import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import {
  UntypedFormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from 'src/app/Models/user.dto';
import { Store } from '@ngrx/store';
import { logout } from 'src/app/store/actions/auth.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerUser: UserDTO;

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  registerForm: FormGroup;
  isValidForm: boolean | null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private store: Store,
    private router: Router
  ) {
    this.registerUser = {} as UserDTO;
    this.isValidForm = null;

    this.name = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);
    this.surname_1 = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);
    this.surname_2 = new FormControl('', [
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);
    this.alias = new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(25),
    ]);
    this.birth_date = new FormControl('', [
      Validators.required,
      Validators.pattern(/^\d{4}-\d{2}-\d{2}$/),
    ]);
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.registerForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  async register(): Promise<void> {
    let responseOK: boolean = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.registerForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.registerUser = this.registerForm.value;

    try {
      const apiResponse = await this.userService
        .register(this.registerUser)
        .toPromise();

      // Validar si el código de estado es 201
      if (apiResponse.status === 201) {
        responseOK = true;
      } else {
        throw new Error('Unexpected API response status');
      }
    } catch (error: any) {
      responseOK = false;
      errorResponse = error.error;

      // Despachar logout para restablecer el estado de autenticación en caso de error
      this.store.dispatch(logout());

      this.sharedService.errorLog(errorResponse);
    }

    await this.sharedService.managementToast(
      'registerFeedback',
      responseOK,
      errorResponse
    );

    if (responseOK) {
      this.registerForm.reset();
      this.birth_date.setValue(formatDate(new Date(), 'yyyy-MM-dd', 'en'));
      this.router.navigateByUrl('home');
    }
  }
}
