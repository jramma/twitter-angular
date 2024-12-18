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
import { Observable } from 'rxjs';
import { selectAuthLoading } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;
  loading$!: Observable<boolean>; // Observable para el spinner

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

  ngOnInit(): void {
    this.loading$ = this.store.select(selectAuthLoading); // Obtener el estado de `loading`
  }

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
        this.store.dispatch(loginSuccess({ credentials: authToken }));
        this.router.navigateByUrl('home');
      },
      error: (error) => {
        responseOK = false;
        errorResponse = error.error;

        this.sharedService.errorLog(error.error);
      },
      complete: async () => {
        await this.sharedService.managementToast(
          'loginFeedback',
          responseOK,
          errorResponse
        );
      },
    });
  }
}
