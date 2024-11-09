import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { SharedService } from 'src/app/Services/shared.service';
import { UserService } from 'src/app/Services/user.service';
import { UserDTO } from 'src/app/Models/user.dto';
import { Store } from '@ngrx/store';
import { selectUserId } from 'src/app/store/selectors/auth.selectors';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  profileUser: UserDTO;

  name: FormControl;
  surname_1: FormControl;
  surname_2: FormControl;
  alias: FormControl;
  birth_date: FormControl;
  email: FormControl;
  password: FormControl;

  profileForm: FormGroup;
  isValidForm: boolean | null;
  userId: string | undefined | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private userService: UserService,
    private sharedService: SharedService,
    private store: Store
  ) {
    this.profileUser = {} as UserDTO;
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

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname_1: this.surname_1,
      surname_2: this.surname_2,
      alias: this.alias,
      birth_date: this.birth_date,
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {
    let errorResponse: any;

    // Obtener userId desde el estado de Redux
    this.store.select(selectUserId).subscribe((userId) => {
      this.userId = userId;

      if (this.userId) {
        this.userService.getUserById(this.userId).subscribe({
          next: (userData) => {
            this.name.setValue(userData.name);
            this.surname_1.setValue(userData.surname_1);
            this.surname_2.setValue(userData.surname_2);
            this.alias.setValue(userData.alias);
            this.birth_date.setValue(
              formatDate(userData.birth_date, 'yyyy-MM-dd', 'en')
            );
            this.email.setValue(userData.email);

            this.profileForm = this.formBuilder.group({
              name: this.name,
              surname_1: this.surname_1,
              surname_2: this.surname_2,
              alias: this.alias,
              birth_date: this.birth_date,
              email: this.email,
              password: this.password,
            });
          },
          error: (error) => {
            errorResponse = error.error;
            this.sharedService.errorLog(errorResponse);
          },
        });
      }
    });
  }

  updateUser(): void {
    let responseOK = false;
    this.isValidForm = false;
    let errorResponse: any;

    if (this.profileForm.invalid) {
      return;
    }

    this.isValidForm = true;
    this.profileUser = this.profileForm.value;

    if (this.userId) {
      this.userService.updateUser(this.userId, this.profileUser).subscribe({
        next: () => {
          responseOK = true;
        },
        error: (error) => {
          responseOK = false;
          errorResponse = error.error;
          this.sharedService.errorLog(errorResponse);
        },
        complete: async () => {
          await this.sharedService.managementToast(
            'profileFeedback',
            responseOK,
            errorResponse
          );
        },
      });
    }
  }
}
