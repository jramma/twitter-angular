import { createSelector } from '@ngrx/store';
import { AuthState } from '../states/auth.state';

export const selectAuthState = (state: any) => state.auth;

export const selectUserId = createSelector(
  selectAuthState,
  (state: AuthState) => state.credentials?.user_id
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.credentials?.access_token
);
export const selectShowAuthSection = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.credentials?.user_id
);
export const selectShowNoAuthSection = createSelector(
  selectAuthState,
  (state: AuthState) => !state.credentials?.user_id // Muestra la sección de no autenticado si no hay user_id
);
