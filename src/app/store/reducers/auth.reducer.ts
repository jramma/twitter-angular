// src/app/store/reducers/auth.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { AuthState } from '../states/auth.state';
import { loginSuccess, loginFailure, logout } from '../actions/auth.actions';
import { AuthDTO } from 'src/app/Models/auth.dto';

export const initialState: AuthState = {
  credentials: null,
  loading: false,
  loaded: false,
  error: null,
};

export const authReducer = createReducer(
  initialState,
  on(loginSuccess, (state, { credentials }) => ({
    ...state,
    credentials, // Aquí se asigna el AuthDTO completo
    loading: false,
    loaded: true,
    error: null,
  })),
  on(loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  on(logout, (state) => ({
    ...state,
    credentials: null,
    loaded: false,
  }))
);
