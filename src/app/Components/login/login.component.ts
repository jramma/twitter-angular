import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/Services/auth.service';
import { HeaderMenusService } from 'src/app/Services/header-menus.service';
import { LocalStorageService } from 'src/app/Services/local-storage.service';
import { SharedService } from 'src/app/Services/shared.service';
import {
  UntypedFormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';

interface AuthToken {
  user_id: string;
  access_token: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;
  loginError: string | null = null;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
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

  // Getters para asegurar el tipo FormControl
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  login(): void {
    let responseOK = false;
    let errorResponse: any;

    const loginData = {
      email: this.email.value,
      password: this.password.value,
    };

    this.authService.login(loginData).subscribe({
      next: (authToken: AuthToken) => {
        responseOK = true;

        this.localStorageService.set('user_id', authToken.user_id);
        this.localStorageService.set('access_token', authToken.access_token);

        const headerInfo: HeaderMenus = {
          showAuthSection: true,
          showNoAuthSection: false,
        };
        this.headerMenusService.headerManagement.next(headerInfo);

        this.router.navigateByUrl('home');
      },
      error: (error) => {
        responseOK = false;
        errorResponse = error.error;

        const headerInfo: HeaderMenus = {
          showAuthSection: false,
          showNoAuthSection: true,
        };
        this.headerMenusService.headerManagement.next(headerInfo);

        this.sharedService.errorLog(error.error);

        this.loginError = error.error?.message || 'Login failed. Try again.';
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
