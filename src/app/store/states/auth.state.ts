// src/app/store/states/auth.state.ts
import { AuthDTO } from '../../Models/auth.dto';

export interface AuthState {
  credentials: AuthDTO | null;
  loading: boolean;
  loaded: boolean;
  error: any;
}

export const initialAuthState: AuthState = {
  credentials: null,
  loading: false,
  loaded: false,
  error: null,
};
