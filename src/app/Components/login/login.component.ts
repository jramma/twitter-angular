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
import { AuthDTO } from 'src/app/Models/auth.dto';
import { HeaderMenus } from 'src/app/Models/header-menus.dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginUser: AuthDTO;
  email: FormControl;
  password: FormControl;
  loginForm: FormGroup;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private authService: AuthService,
    private sharedService: SharedService,
    private headerMenusService: HeaderMenusService,
    private localStorageService: LocalStorageService,
    private router: Router
  ) {
    this.loginUser = {} as AuthDTO;

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

    this.loginUser.email = this.email.value;
    this.loginUser.password = this.password.value;

    this.authService.login(this.loginUser).subscribe({
      next: (authToken) => {
        responseOK = true;
        this.loginUser.user_id = authToken.user_id;
        this.loginUser.access_token = authToken.access_token;
        // Guardar token en localStorage
        this.localStorageService.set('user_id', this.loginUser.user_id);
        this.localStorageService.set(
          'access_token',
          this.loginUser.access_token
        );

        // Actualizar header para usuario autenticado
        const headerInfo: HeaderMenus = {
          showAuthSection: true,
          showNoAuthSection: false,
        };
        this.headerMenusService.headerManagement.next(headerInfo);

        // Navegar a la página principal
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
      },
      complete: async () => {
        // Mostrar notificación de feedback
        await this.sharedService.managementToast(
          'loginFeedback',
          responseOK,
          errorResponse
        );
      },
    });
  }
}
