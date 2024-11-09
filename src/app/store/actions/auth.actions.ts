// src/app/store/actions/auth.actions.ts
import { createAction, props } from '@ngrx/store';
import { AuthDTO } from '../../Models/auth.dto';

export const login = createAction(
  '[Auth] Login',
  props<{ credentials: AuthDTO }>()
);
export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ credentials: AuthDTO }>()
);
export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);
export const logout = createAction('[Auth] Logout');
