import { createSelector } from '@ngrx/store';
import { AuthState } from '../states/auth.state';

export const selectAuthState = (state: any) => state.auth;

export const selectUserId = createSelector(
  selectAuthState,
  (state: AuthState) => state.credentials?.user_id ?? null
);

export const selectAccessToken = createSelector(
  selectAuthState,
  (state: AuthState) => state.credentials?.access_token
);

export const selectAuthLoading = createSelector(
  selectAuthState,
  (state: AuthState) => state.loading
);

export const selectShowAuthSection = createSelector(
  selectAuthState,
  (state: AuthState) => !!state.credentials?.user_id
);

export const selectShowNoAuthSection = createSelector(
  selectAuthState,
  (state: AuthState) => !state.credentials?.user_id
);
