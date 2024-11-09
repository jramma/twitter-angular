import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { SharedService } from 'src/app/Services/shared.service';
import {
  UntypedFormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Store } from '@ngrx/store';
import { loginSuccess } from 'src/app/store/actions/auth.actions';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private store: Store,
    private router: Router
  ) {
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.password = new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.maxLength(16),
    ]);

    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {}

  login(): void {
    let responseOK = false;
    let errorResponse: any;

    const loginData = {
      email: this.email.value,
      password: this.password.value,
    };

    this.authService.login(loginData).subscribe({
      next: (authToken: any) => {
        responseOK = true;

        // Despachar la acción loginSuccess con las credenciales
        this.store.dispatch(loginSuccess({ credentials: authToken }));

        // Navegar a la página principal
        this.router.navigateByUrl('home');
      },
      error: (error) => {
        responseOK = false;
        errorResponse = error.error;

        // Registrar error
        this.sharedService.errorLog(error.error);
      },
      complete: async () => {
        // Mostrar feedback del login
        await this.sharedService.managementToast(
          'loginFeedback',
          responseOK,
          errorResponse
        );
      },
    });
  }
}
